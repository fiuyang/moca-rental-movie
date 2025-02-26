import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { Movie } from '../movie/entities/movie.entity';
import { User } from '../user/entities/user.entity';
import { BankTransferResponseDto } from './dto/bank-transfer-response.dto';

@Injectable()
export class MidtransService {
  private midtransBaseUrl: string;
  private midtransServerKey: string;
  private midtransAuthToken: string;

  constructor(private configService: ConfigService) {
    this.midtransBaseUrl = this.configService.get<string>('MIDTRANS_BASE_URL');
    this.midtransServerKey = this.configService.get<string>(
      'MIDTRANS_SERVER_KEY',
    );
    this.midtransAuthToken = Buffer.from(`${this.midtransServerKey}:`).toString(
      'base64',
    );
  }

  async pay(
    orderId: string,
    amount: number,
    bank: string,
    movie: Movie,
    user: User,
  ): Promise<BankTransferResponseDto> {
    const response = await axios.post(
      this.midtransBaseUrl,
      {
        payment_type: 'bank_transfer',
        transaction_details: { order_id: orderId, gross_amount: amount },
        item_details: [
          {
            id: movie.id,
            name: movie.title,
            price: amount,
            quantity: 1,
          },
        ],
        customer_details: {
          first_name: user.name,
          email: user.email,
          phone: user.phone_number,
        },
        bank_transfer: { bank },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.midtransAuthToken,
        },
      },
    );

    return response.data;
  }
}
