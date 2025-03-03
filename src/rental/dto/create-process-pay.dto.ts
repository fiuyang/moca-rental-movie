import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { IsExist } from '../../common/validator/exist.validator';
import { Rental } from '../entities/rental.entity';

export enum Bank {
  BRI = 'bri',
  BCA = 'bca',
  BNI = 'bni',
}

export class CreateProcessPayDto {
  @ApiProperty({
    required: false,
    example: '9abfc1ca-adc2-4894-84df-4f99df561708',
  })
  @IsNotEmpty()
  @IsExist([Rental, 'id'])
  rental_id: string;

  @ApiProperty({ required: false, example: Bank.BRI, enum: Bank })
  @IsNotEmpty()
  @IsEnum(Bank)
  bank: Bank;
}

export class CreatePaymentCashDto {
  @ApiProperty({
    required: false,
    example: '9abfc1ca-adc2-4894-84df-4f99df561708',
  })
  @IsNotEmpty()
  @IsExist([Rental, 'id'])
  rental_id: string;
}
