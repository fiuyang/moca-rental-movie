import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Genre } from './entities/genre.entity';
import { PagingResponse } from 'src/common/interface/web.interface';
import { paginate } from '../common/helper/paging.helper';
import { FilterGenre } from './dto/filter-genre.dto';
import { GenreResponseDto } from './dto/genre-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class GenreService {
  constructor(
    @InjectRepository(Genre)
    private readonly genreRepo: Repository<Genre>,
  ) {}

  async create(createGenreDto: CreateGenreDto): Promise<void> {
    const data = this.genreRepo.create(createGenreDto);
    await this.genreRepo.save(data);
  }

  async findAll(
    filter: FilterGenre,
  ): Promise<{ data: GenreResponseDto[]; paging: PagingResponse }> {
    const queryBuilder = this.genreRepo.createQueryBuilder('genre');

    if (filter.name) {
      queryBuilder.andWhere('genre.name LIKE :name', {
        name: `%${filter.name}%`,
      });
    }

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
      data: plainToInstance(GenreResponseDto, data, {
        excludeExtraneousValues: true,
      }),
      paging,
    };
  }

  async findOne(id: string): Promise<GenreResponseDto> {
    const data = await this.genreRepo.findOne({ where: { id: id } });
    if (!data) {
      throw new NotFoundException('Genre not found');
    }
    return plainToInstance(GenreResponseDto, data, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: string, updateGenreDto: UpdateGenreDto): Promise<void> {
    const data = await this.genreRepo.preload({
      id: id,
      ...updateGenreDto,
    });

    if (!data) {
      throw new NotFoundException('Genre not found');
    }

    await this.genreRepo.save(data);
  }

  async remove(id: string): Promise<void> {
    const data = await this.genreRepo.delete(id);
    if (!data) {
      throw new NotFoundException('Genre not found');
    }
  }
}
