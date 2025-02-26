import { IsNotEmpty, IsString } from 'class-validator';
import { Rental } from '../../rental/entities/rental.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsExist } from '../../common/validator/exist.validator';
import { User } from '../../user/entities/user.entity';

export class PayLateFeeDto {
  @ApiProperty({
    required: false,
    example: '9abfc1ca-adc2-4894-84df-4f99df561708',
  })
  @IsString()
  @IsNotEmpty()
  @IsExist([Rental, 'id'])
  rental_id: string;

  @ApiProperty({
    required: false,
    example: '9134ed95-237f-4c56-980b-621ce11f618b',
  })
  @IsString()
  @IsNotEmpty()
  @IsExist([User, 'id'])
  user_id: string;

  @ApiProperty({ required: false, example: 'cash' })
  @IsString()
  @IsNotEmpty()
  payment_method: string;
}
