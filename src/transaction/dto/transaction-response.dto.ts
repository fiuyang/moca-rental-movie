import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { BaseResponseDto } from '../../common/dto/base-response.dto';
import { RentalResponseDto } from '../../rental/dto/rental-response.dto';
import { UserResponseDto } from '../../user/dto/user-response.dto';

export class TransactionResponseDto extends BaseResponseDto {
  @ApiProperty({ type: () => RentalResponseDto, nullable: true })
  @Expose()
  @Type(() => RentalResponseDto)
  rental?: RentalResponseDto;

  @ApiProperty({ type: () => UserResponseDto, nullable: true })
  @Expose()
  @Type(() => UserResponseDto)
  user?: UserResponseDto;

  @ApiProperty({ example: 'bank' })
  @Expose()
  payment_method: string;

  @ApiProperty({ example: 'ORDER-20250225-001' })
  @Expose()
  order_id: string;

  @ApiProperty({ example: 15000.0 })
  @Expose()
  @Transform(({ value }) => parseFloat(value))
  gross_amount: number;

  @ApiProperty({
    example: 'pending',
    enum: ['pending', 'settlement', 'failed', 'expire', 'paid'],
  })
  @Expose()
  status: string;

  @ApiProperty({
    example: 'rental',
    enum: ['rental', 'late_fee'],
  })
  @Expose()
  payment_type: 'rental' | 'late_fee';
}
