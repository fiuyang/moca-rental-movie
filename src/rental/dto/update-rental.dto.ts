import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class UpdateRentalDto {
  @IsOptional()
  id?: string;

  @ApiProperty({
    example: 'returned',
    enum: ['ongoing', 'returned', 'overdue'],
    required: true,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  rental_status: string;

  @ApiProperty({ example: '2024-02-26 14:30', required: false })
  @IsOptional()
  @Type(() => Date)
  @Transform(({ value }) => (value ? new Date(value) : null), {
    toClassOnly: true,
  }) // Konversi ke Date
  @Transform(
    ({ value }) =>
      value ? value.toISOString().slice(0, 16).replace('T', ' ') : null,
    { toPlainOnly: true },
  ) // Format output
  returned_at: Date;
}
