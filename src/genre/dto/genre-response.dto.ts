import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../../common/dto/base-response.dto';
import { Expose } from 'class-transformer';

export class GenreResponseDto extends BaseResponseDto {
  @ApiProperty({ example: 'Horror' })
  @Expose()
  name: string;
}
