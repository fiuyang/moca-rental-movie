import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { IsUnique } from '../../common/validator/unique.validator';
import { User } from '../../user/entities/user.entity';

export class SignUpDto {
  @ApiProperty({ required: true, example: 'rental@moca.com' })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsUnique([User, 'email'])
  email: string;

  @ApiProperty({ required: true, example: '0896453747' })
  @IsNotEmpty()
  @IsUnique([User, 'phone_number'])
  phone_number: string;

  @ApiProperty({ required: true, example: 'password' })
  @IsNotEmpty()
  @Length(8, 20, { message: 'Password must be between 8 and 20 characters' })
  password: string;

  @ApiProperty({ required: true, example: 'john' })
  @IsNotEmpty()
  @IsString()
  name: string;
}
