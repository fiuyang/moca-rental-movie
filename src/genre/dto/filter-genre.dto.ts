import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDto } from '../../common/dto/base-filter.dto';

export class FilterGenre extends BaseFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;
}
