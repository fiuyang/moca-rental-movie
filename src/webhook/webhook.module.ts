import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rental } from '../rental/entities/rental.entity';
import { RentalModule } from '../rental/rental.module';
import { Transaction } from '../transaction/entities/transaction.entity';
import { TransactionModule } from '../transaction/transaction.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, Rental]),
    RentalModule,
    TransactionModule,
  ],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
