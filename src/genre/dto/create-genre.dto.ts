import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { IsUnique } from '../../common/validator/unique.validator';
import { Genre } from '../entities/genre.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGenreDto {
  @ApiProperty({ required: false, example: 'Horror' })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(50)
  @IsUnique([Genre, 'name'])
  name: string;
}
