import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../../common/dto/base-response.dto';
import { Exclude, Expose } from 'class-transformer';

export class UserResponseDto extends BaseResponseDto {
  @Exclude()
  password: string;

  @ApiProperty({ example: 'john' })
  @Expose()
  name: string;

  @ApiProperty({ example: 'john@moca.com' })
  @Expose()
  email: string;

  @ApiProperty({ example: '0895746354545' })
  @Expose()
  phone_number: string;

  @ApiProperty({ example: 'renter' })
  @Expose()
  role: string;
}
