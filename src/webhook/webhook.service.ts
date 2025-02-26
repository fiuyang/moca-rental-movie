import { BadRequestException, Injectable } from '@nestjs/common';
import { verifySignature } from '../common/util/signature.util';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { MidtransWebhookDto } from './dto/midtrans.dto';
import { Transaction } from '../transaction/entities/transaction.entity';

@Injectable()
export class WebhookService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
    private readonly dataSource: DataSource,
  ) {}

  async midtransWebhook(payload: MidtransWebhookDto) {
    const isValid = verifySignature(payload);

    if (!isValid) {
      throw new BadRequestException('Invalid signature');
    }

    const transaction = await this.transactionRepo.findOne({
      where: { order_id: payload.order_id },
      relations: ['rental', 'rental.movie'],
    });

    if (!transaction) {
      throw new BadRequestException('Transaction not found.');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (
        transaction.status === 'paid' &&
        payload.transaction_status !== 'settlement'
      ) {
        throw new BadRequestException('Cannot downgrade transaction status.');
      }

      switch (payload.transaction_status) {
        case 'settlement':
          transaction.status = 'paid';
          break;
        case 'cancel':
        case 'expire':
        case 'failure':
          transaction.status = 'failed';
          await queryRunner.manager.increment(
            'movies',
            { id: transaction.rental.movie.id },
            'stock',
            1,
          );
          break;
        case 'pending':
          transaction.status = 'pending';
          break;
        default:
          throw new BadRequestException('Unknown transaction status.');
      }

      await queryRunner.manager.save(transaction);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
