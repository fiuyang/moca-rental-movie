import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { IsExist } from '../../common/validator/exist.validator';
import { Movie } from '../../movie/entities/movie.entity';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';

export class CreateRentalDto {
  @ApiProperty({
    required: false,
    example: '9abfc1ca-adc2-4894-84df-4f99df561708',
  })
  @IsNotEmpty()
  @IsExist([User, 'id'])
  user_id: string;

  @ApiProperty({
    required: false,
    example: '9134ed95-237f-4c56-980b-621ce11f618b',
  })
  @IsNotEmpty()
  @IsExist([Movie, 'id'])
  movie_id: string;

  @ApiProperty({ required: true, example: 3 })
  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  rental_days: number;
}
