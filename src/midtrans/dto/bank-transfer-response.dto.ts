import { ApiProperty } from '@nestjs/swagger';

class VANumber {
  @ApiProperty({ example: 'bca' })
  bank: string;

  @ApiProperty({ example: '75235588852119879139040' })
  va_number: string;
}

export class BankTransferResponseDto {
  @ApiProperty({ example: '201' })
  status_code: string;

  @ApiProperty({ example: 'Success, Bank Transfer transaction is created' })
  status_message: string;

  @ApiProperty({ example: 'RENTAL-1740479719866-217' })
  order_id: string;

  @ApiProperty({ example: '30000.00' })
  gross_amount: string;

  @ApiProperty({ example: 'IDR' })
  currency: string;

  @ApiProperty({ example: 'bank_transfer' })
  payment_type: string;

  @ApiProperty({ example: '2025-02-25 17:35:17' })
  transaction_time: string;

  @ApiProperty({ example: 'pending' })
  transaction_status: string;

  @ApiProperty({ example: 'accept' })
  fraud_status: string;

  @ApiProperty({ type: [VANumber] })
  va_numbers: VANumber[];

  @ApiProperty({ example: '2025-02-26 17:35:16' })
  expiry_time: string;
}
