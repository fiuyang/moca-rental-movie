import { BaseResponseDto } from '../../common/dto/base-response.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { MovieResponseDto } from '../../movie/dto/movie-response.dto';

export class MovieWithoutGenresDto extends OmitType(MovieResponseDto, [
  'genres',
] as const) {}

export class RentalResponseDto extends BaseResponseDto {
  @ApiProperty({ example: '2025-02-20' })
  @Expose()
  rental_date: string;

  @ApiProperty({ example: '2025-02-22' })
  @Expose()
  return_date: string;

  @ApiProperty({ example: '2025-02-23', nullable: true })
  @Expose()
  returned_at?: string;

  @ApiProperty({ example: 20000 })
  @Expose()
  @Transform(({ value }) => parseFloat(value))
  total_price: number;

  @ApiProperty({ example: 'paid', enum: ['pending', 'paid', 'cancelled'] })
  @Expose()
  payment_status: string;

  @ApiProperty({
    example: 'returned',
    enum: ['ongoing', 'returned', 'overdue'],
  })
  @Expose()
  rental_status: string;

  @ApiProperty({ example: 5000 })
  @Expose()
  @Transform(({ value }) => parseFloat(value))
  late_fee: number;

  @ApiProperty({ type: () => MovieWithoutGenresDto, nullable: true })
  @Expose()
  @Type(() => MovieWithoutGenresDto)
  movie?: MovieWithoutGenresDto;
}
