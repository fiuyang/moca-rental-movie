import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { GenreResponseDto } from '../../genre/dto/genre-response.dto';
import { BaseResponseDto } from '../../common/dto/base-response.dto';

export class MovieResponseDto extends BaseResponseDto {
  @ApiProperty({ example: 'Hunter x Hunter' })
  @Expose()
  title: string;

  @ApiProperty({ type: () => [GenreResponseDto] })
  @Expose()
  @Type(() => GenreResponseDto)
  genres: GenreResponseDto[];

  @ApiProperty({ example: 10 })
  @Expose()
  stock: number;

  @ApiProperty({ example: 10000 })
  @Expose({ name: 'dailyRentalRate' })
  @Transform(({ value }) => parseFloat(value))
  daily_rental_rate: number;
}
