import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MidtransWebhookDto {
  @ApiProperty({ required: true, example: 'xxxx' })
  @IsNotEmpty()
  @IsString()
  order_id: string;

  @ApiProperty({ required: true, example: 'pending' })
  @IsNotEmpty()
  @IsString()
  transaction_status: string;

  @ApiProperty({ required: true, example: '60000.00' })
  @IsNotEmpty()
  gross_amount: string;

  @ApiProperty({ required: true, example: '200' })
  @IsNotEmpty()
  @IsString()
  status_code: string;

  @ApiProperty()
  @IsNotEmpty()
  signature_key: string;
}
