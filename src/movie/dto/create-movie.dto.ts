import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsUnique } from '../../common/validator/unique.validator';
import { Movie } from '../entities/movie.entity';
import { IsExist } from '../../common/validator/exist.validator';
import { Genre } from '../../genre/entities/genre.entity';

export class CreateMovieDto {
  @ApiProperty({ required: false, example: 'Hunter x Hunter (2012)' })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(255)
  @IsUnique([Movie, 'title'])
  title: string;

  @ApiProperty({ required: false, example: ['Action', 'Fantasy', 'Adventure'] })
  @IsNotEmpty()
  @IsString({ each: true })
  @IsExist([Genre, 'name'])
  genres: string[];

  @ApiProperty({ required: false, example: 30 })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(2000)
  stock: number;

  @ApiProperty({ required: false, example: 10000 })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  daily_rental_rate: number;
}
