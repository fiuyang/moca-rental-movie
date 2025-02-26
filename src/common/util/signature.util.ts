import * as crypto from 'crypto';
import { MidtransWebhookDto } from '../../webhook/dto/midtrans.dto';
import { InternalServerErrorException } from '@nestjs/common';

export function verifySignature(payload: MidtransWebhookDto): boolean {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  if (!serverKey) {
    throw new InternalServerErrorException(
      'server key is not set in environment variables',
    );
  }

  const dataString = `${payload.order_id}${payload.status_code}${payload.gross_amount}${serverKey}`;

  const calculatedSignature = crypto
    .createHash('sha512')
    .update(dataString, 'utf-8')
    .digest('hex');

  console.log('calculatedSignature', calculatedSignature);
  return calculatedSignature === payload.signature_key;
}
