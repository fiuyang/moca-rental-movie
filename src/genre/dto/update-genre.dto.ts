import { PartialType } from '@nestjs/swagger';
import { CreateGenreDto } from './create-genre.dto';
import { IsOptional } from 'class-validator';

export class UpdateGenreDto extends PartialType(CreateGenreDto) {
  @IsOptional()
  id?: string;
}
