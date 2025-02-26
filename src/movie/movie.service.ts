import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { Genre } from '../genre/entities/genre.entity';
import { Repository } from 'typeorm';
import { BaseFilterDto } from '../common/dto/base-filter.dto';
import { PagingResponse } from '../common/interface/web.interface';
import { paginate } from '../common/helper/paging.helper';
import { MovieResponseDto } from './dto/movie-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepo: Repository<Movie>,
    @InjectRepository(Genre)
    private readonly genreRepo: Repository<Genre>,
  ) {}

  async create(createMovieDto: CreateMovieDto): Promise<void> {
    const genres = await Promise.all(
      createMovieDto.genres.map((name) => this.preloadGenresByName(name)),
    );

    const movie = this.movieRepo.create({
      ...createMovieDto,
      genres,
      dailyRentalRate: createMovieDto.daily_rental_rate,
    });

    await this.movieRepo.save(movie);
  }

  async findAll(
    filter: BaseFilterDto,
  ): Promise<{ data: MovieResponseDto[]; paging: PagingResponse }> {
    const queryBuilder = this.movieRepo
      .createQueryBuilder('movie')
      .leftJoinAndSelect('movie.genres', 'genre');

    if (filter.start_date && filter.end_date) {
      queryBuilder.andWhere(
        'genre.created_at BETWEEN :start_date AND :end_date',
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
      data: plainToInstance(MovieResponseDto, data, {
        excludeExtraneousValues: true,
      }),
      paging,
    };
  }

  async findOne(id: string): Promise<MovieResponseDto> {
    const data = await this.movieRepo.findOne({
      where: { id: id },
      relations: ['genres'],
    });
    if (!data) {
      throw new NotFoundException(`Movie not found`);
    }
    return plainToInstance(MovieResponseDto, data, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: string, updateMovieDto: UpdateMovieDto): Promise<void> {
    const genres =
      updateMovieDto.genres &&
      (await Promise.all(
        updateMovieDto.genres.map((name) => this.preloadGenresByName(name)),
      ));
    const movie = await this.movieRepo.preload({
      id: id,
      ...updateMovieDto,
      genres,
      dailyRentalRate: updateMovieDto.daily_rental_rate,
    });
    if (!movie) throw new NotFoundException(`movie with id #${id} not found.`);

    await this.movieRepo.save(movie);
  }

  async remove(id: string): Promise<void> {
    const data = await this.movieRepo.delete(id);
    if (!data) {
      throw new NotFoundException(`Movie not found`);
    }
  }

  private async preloadGenresByName(name: string): Promise<Genre> {
    const existingGenre = await this.genreRepo.findOne({
      where: { name: name },
    });
    if (existingGenre) return existingGenre;
    return this.genreRepo.create({ name });
  }
}
