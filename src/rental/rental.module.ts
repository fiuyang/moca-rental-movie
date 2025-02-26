import { Module } from '@nestjs/common';
import { RentalService } from './rental.service';
import { RentalController } from './rental.controller';
import { Rental } from './entities/rental.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MidtransModule } from '../midtrans/midtrans.module';
import { TransactionModule } from '../transaction/transaction.module';
import { Movie } from '../movie/entities/movie.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rental, Movie]),
    MidtransModule,
    TransactionModule,
  ],
  controllers: [RentalController],
  providers: [RentalService],
})
export class RentalModule {}
