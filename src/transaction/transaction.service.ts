import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Rental } from '../rental/entities/rental.entity';
import { Transaction } from './entities/transaction.entity';
import { PagingResponse } from '../common/interface/web.interface';
import { paginate } from '../common/helper/paging.helper';
import { plainToInstance } from 'class-transformer';
import { FilterTransaction } from './dto/filter-transaction.dto';
import { TransactionResponseDto } from './dto/transaction-response.dto';
import { PayLateFeeDto } from './dto/pay-late-fee.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
    @InjectRepository(Rental)
    private readonly rentalRepo: Repository<Rental>,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    user_id: string,
    rental_id: string,
    payment_method: string,
    order_id: string,
    gross_amount: number,
  ): Promise<void> {
    const transaction = this.transactionRepo.create({
      rental: { id: rental_id },
      user: { id: user_id },
      payment_method: payment_method,
      order_id: order_id,
      gross_amount: gross_amount,
      status: 'pending',
      payment_type: 'rental',
    });

    await this.transactionRepo.save(transaction);
  }

  async findAll(
    filter: FilterTransaction,
  ): Promise<{ data: TransactionResponseDto[]; paging: PagingResponse }> {
    const queryBuilder = this.transactionRepo
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.rental', 'rental')
      .leftJoinAndSelect('transaction.user', 'user');

    if (filter.status) {
      queryBuilder.andWhere('transaction.status LIKE :status', {
        status: `%${filter.status}%`,
      });
    }

    if (filter.order_id) {
      queryBuilder.andWhere('transaction.order_id LIKE :order_id', {
        order_id: `%${filter.order_id}%`,
      });
    }

    if (filter.payment_type) {
      queryBuilder.andWhere('transaction.payment_type LIKE :payment_type', {
        payment_type: `%${filter.payment_type}%`,
      });
    }

    if (filter.name) {
      queryBuilder.andWhere('LOWER(user.name) LIKE LOWER(:name)', {
        name: `%${filter.name}%`,
      });
    }

    if (filter.start_date && filter.end_date) {
      queryBuilder.andWhere(
        'transaction.created_at BETWEEN :start_date AND :end_date',
        {
          start_date: filter.start_date,
          end_date: filter.end_date,
        },
      );
    }

    const page = filter.page;
    const limit = filter.limit;

    const { data, paging } = await paginate(queryBuilder, { page, limit });

    return {
      data: plainToInstance(TransactionResponseDto, data, {
        excludeExtraneousValues: true,
      }),
      paging,
    };
  }

  async findAllHistory(
    filter: FilterTransaction,
    userId: string,
  ): Promise<{ data: TransactionResponseDto[]; paging: PagingResponse }> {
    const queryBuilder = this.transactionRepo
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.rental', 'rental')
      .leftJoinAndSelect('transaction.user', 'user')
      .where('transaction.userId = :userId', { userId });

    if (filter.status) {
      queryBuilder.andWhere('transaction.status LIKE :status', {
        status: `%${filter.status}%`,
      });
    }

    if (filter.order_id) {
      queryBuilder.andWhere('transaction.order_id LIKE :order_id', {
        order_id: `%${filter.order_id}%`,
      });
    }

    if (filter.payment_type) {
      queryBuilder.andWhere('transaction.payment_type LIKE :payment_type', {
        payment_type: `%${filter.payment_type}%`,
      });
    }

    if (filter.name) {
      queryBuilder.andWhere('LOWER(user.name) LIKE LOWER(:name)', {
        name: `%${filter.name}%`,
      });
    }

    if (filter.start_date && filter.end_date) {
      queryBuilder.andWhere(
        'transaction.created_at BETWEEN :start_date AND :end_date',
        {
          start_date: filter.start_date,
          end_date: filter.end_date,
        },
      );
    }

    const page = filter.page;
    const limit = filter.limit;

    const { data, paging } = await paginate(queryBuilder, { page, limit });
    console.log('data', data);
    return {
      data: plainToInstance(TransactionResponseDto, data, {
        excludeExtraneousValues: true,
      }),
      paging,
    };
  }

  async findOne(id: string): Promise<TransactionResponseDto> {
    const data = await this.transactionRepo.findOne({
      where: { id },
      relations: ['user', 'rental'],
    });

    if (!data) throw new NotFoundException(`Transaction not found.`);

    return plainToInstance(TransactionResponseDto, data, {
      excludeExtraneousValues: true,
    });
  }

  async payLateFee(dto: PayLateFeeDto): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const rental = await queryRunner.manager.findOne(Rental, {
        where: { id: dto.rental_id },
      });
      if (!rental || rental.late_fee === 0) {
        throw new BadRequestException('Rental not found or no late fee.');
      }

      const latePayment = queryRunner.manager.create(Transaction, {
        rental: { id: dto.rental_id },
        user: { id: dto.user_id },
        payment_method: dto.payment_method,
        order_id: `FINE-${Date.now()}`,
        gross_amount: rental.late_fee,
        status: 'paid',
        payment_type: 'late_fee',
      });

      await queryRunner.manager.save(Transaction, latePayment);

      rental.late_fee = 0;
      await queryRunner.manager.save(Rental, rental);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }
}
