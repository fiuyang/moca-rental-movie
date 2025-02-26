import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { Rental } from './entities/rental.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Movie } from '../movie/entities/movie.entity';
import { MidtransService } from '../midtrans/midtrans.service';
import { TransactionService } from '../transaction/transaction.service';
import { CreateProcessPayDto } from './dto/create-process-pay.dto';
import { RentalResponseDto } from './dto/rental-response.dto';
import { FilterRental } from './dto/filter-rental.dto';
import { paginate } from '../common/helper/paging.helper';
import { plainToInstance } from 'class-transformer';
import { PagingResponse } from '../common/interface/web.interface';
import { BankTransferResponseDto } from '../midtrans/dto/bank-transfer-response.dto';
import { PayLateFeeDto } from '../transaction/dto/pay-late-fee.dto';

@Injectable()
export class RentalService {
  constructor(
    @InjectRepository(Rental)
    private readonly rentalRepo: Repository<Rental>,
    @InjectRepository(Movie)
    private readonly movieRepo: Repository<Movie>,
    private readonly midtransService: MidtransService,
    private readonly transactionService: TransactionService,
    private readonly dataSource: DataSource,
  ) {}

  async create(createRentalDto: CreateRentalDto): Promise<string> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const movie = await queryRunner.manager.findOne(Movie, {
        where: { id: createRentalDto.movie_id },
      });
      if (!movie) {
        throw new NotFoundException('Movie not found');
      }

      if (movie.stock <= 0) {
        throw new BadRequestException('Movie is out of stock');
      }

      movie.stock -= 1;
      await queryRunner.manager.save(Movie, movie);

      const totalPrice = createRentalDto.rental_days * movie.dailyRentalRate;
      const rentalDate = new Date();
      const returnDate = new Date();
      returnDate.setDate(rentalDate.getDate() + createRentalDto.rental_days);

      const rental = queryRunner.manager.create(Rental, {
        user: { id: createRentalDto.user_id },
        movie: { id: createRentalDto.movie_id },
        rental_date: rentalDate,
        return_date: returnDate,
        total_price: totalPrice,
        payment_status: 'pending',
      });

      await queryRunner.manager.save(Rental, rental);

      await queryRunner.commitTransaction();
      return rental.id;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async processPayment(
    createProcessPayDto: CreateProcessPayDto,
  ): Promise<BankTransferResponseDto> {
    const rental = await this.rentalRepo.findOne({
      where: { id: createProcessPayDto.rental_id },
      relations: ['user', 'movie'],
    });

    if (!rental) {
      throw new NotFoundException('Rental not found');
    }

    if (rental.payment_status !== 'pending') {
      throw new BadRequestException('Payment already processed');
    }

    const { user, movie, total_price } = rental;
    const orderId = `RENTAL-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const grossAmount = Number(total_price); // Konversi ke angka

    try {
      const paymentResponse = await this.midtransService.pay(
        orderId,
        grossAmount,
        createProcessPayDto.bank,
        movie,
        user,
      );

      await this.transactionService.create(
        user.id,
        rental.id,
        createProcessPayDto.bank,
        orderId,
        grossAmount,
      );

      return paymentResponse;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to process transaction',
        error,
      );
    }
  }

  async processPayLateFee(dto: PayLateFeeDto): Promise<void> {
    await this.transactionService.payLateFee(dto);
  }

  async findAll(
    filter: FilterRental,
  ): Promise<{ data: RentalResponseDto[]; paging: PagingResponse }> {
    const queryBuilder = this.rentalRepo
      .createQueryBuilder('rental')
      .leftJoinAndSelect('rental.movie', 'movie')
      .leftJoinAndSelect('rental.user', 'user');

    if (filter.rental_status) {
      queryBuilder.andWhere('rental.rental_status LIKE :rental_status', {
        rental_status: `%${filter.rental_status}%`,
      });
    }

    if (filter.name) {
      queryBuilder.andWhere('LOWER(user.name) LIKE LOWER(:name)', {
        name: `%${filter.name}%`,
      });
    }

    if (filter.email) {
      queryBuilder.andWhere('LOWER(user.email) LIKE LOWER(:email)', {
        email: `%${filter.email}%`,
      });
    }

    if (filter.title) {
      queryBuilder.andWhere('LOWER(movie.title) LIKE LOWER(:title)', {
        title: `%${filter.title}%`,
      });
    }

    if (filter.start_date && filter.end_date) {
      queryBuilder.andWhere(
        'rental.created_at BETWEEN :start_date AND :end_date',
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
      data: plainToInstance(RentalResponseDto, data, {
        excludeExtraneousValues: true,
      }),
      paging,
    };
  }

  async findAllHistory(
    filter: FilterRental,
    userId: string,
  ): Promise<{ data: RentalResponseDto[]; paging: PagingResponse }> {
    const queryBuilder = this.rentalRepo
      .createQueryBuilder('rental')
      .leftJoinAndSelect('rental.movie', 'movie')
      .leftJoinAndSelect('rental.user', 'user')
      .where('rental.userId = :userId', { userId });

    if (filter.rental_status) {
      queryBuilder.andWhere('rental.rental_status LIKE :rental_status', {
        rental_status: `%${filter.rental_status}%`,
      });
    }

    if (filter.name) {
      queryBuilder.andWhere('LOWER(user.name) LIKE LOWER(:name)', {
        name: `%${filter.name}%`,
      });
    }

    if (filter.email) {
      queryBuilder.andWhere('LOWER(user.email) LIKE LOWER(:email)', {
        email: `%${filter.email}%`,
      });
    }

    if (filter.title) {
      queryBuilder.andWhere('LOWER(movie.title) LIKE LOWER(:title)', {
        title: `%${filter.title}%`,
      });
    }

    if (filter.start_date && filter.end_date) {
      queryBuilder.andWhere(
        'rental.created_at BETWEEN :start_date AND :end_date',
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
      data: plainToInstance(RentalResponseDto, data, {
        excludeExtraneousValues: true,
      }),
      paging,
    };
  }

  async findOverdueRentals(
    filter: FilterRental,
  ): Promise<{ data: RentalResponseDto[]; paging: PagingResponse }> {
    const queryBuilder = this.rentalRepo
      .createQueryBuilder('rental')
      .leftJoinAndSelect('rental.movie', 'movie')
      .leftJoinAndSelect('rental.user', 'user')
      .where('rental.rental_status = :status', { status: 'overdue' });

    if (filter.start_date && filter.end_date) {
      queryBuilder.andWhere(
        'rental.created_at BETWEEN :start_date AND :end_date',
        {
          start_date: filter.start_date,
          end_date: filter.end_date,
        },
      );
    }

    if (filter.name) {
      queryBuilder.andWhere('LOWER(user.name) LIKE LOWER(:name)', {
        name: `%${filter.name}%`,
      });
    }

    if (filter.email) {
      queryBuilder.andWhere('LOWER(user.email) LIKE LOWER(:email)', {
        email: `%${filter.email}%`,
      });
    }

    if (filter.title) {
      queryBuilder.andWhere('LOWER(movie.title) LIKE LOWER(:title)', {
        title: `%${filter.title}%`,
      });
    }

    const page = filter.page ?? 1;
    const limit = filter.limit ?? 10;

    const { data, paging } = await paginate(queryBuilder, { page, limit });

    return {
      data: plainToInstance(RentalResponseDto, data, {
        excludeExtraneousValues: true,
      }),
      paging,
    };
  }

  async findOne(id: string): Promise<RentalResponseDto> {
    const data = await this.rentalRepo.findOne({
      where: { id },
      relations: ['movie', 'user'],
    });

    if (!data) throw new NotFoundException(`Rental not found.`);

    return plainToInstance(RentalResponseDto, data, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: string, updateRentalDto: UpdateRentalDto): Promise<void> {
    const rental = await this.rentalRepo.findOne({ where: { id }, relations: ['movie'] });
    if (!rental) throw new NotFoundException('Rental not found.');

    let late_fee = rental.late_fee;
    if (updateRentalDto.returned_at) {
      const returnedAt = new Date(updateRentalDto.returned_at);
      const returnDate = new Date(rental.return_date);

      if (returnedAt > returnDate) {
        const diffDays = Math.ceil(
          (returnedAt.getTime() - returnDate.getTime()) / (1000 * 60 * 60 * 24),
        );
        late_fee = diffDays * 5000;
      }

      if (rental.movie) {
        rental.movie.stock += 1;
        await this.movieRepo.save(rental.movie);
      }
    }

    Object.assign(rental, updateRentalDto, {
      late_fee,
      returned_at: updateRentalDto.returned_at
        ? new Date(updateRentalDto.returned_at)
        : rental.returned_at,
    });

    await this.rentalRepo.save(rental);
  }

  async remove(id: string): Promise<void> {
    const data = await this.rentalRepo.delete(id);
    if (!data) {
      throw new NotFoundException(`Rental not found.`);
    }
  }
}
