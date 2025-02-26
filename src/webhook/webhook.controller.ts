import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { MidtransWebhookDto } from './dto/midtrans.dto';
import { ApiBody } from '@nestjs/swagger';
import { webResponse } from '../common/helper/web.helper';
import { WebResponse } from '../common/interface/web.interface';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('midtrans')
  @ApiBody({ type: MidtransWebhookDto })
  async midtransWebhook(@Body() payload: MidtransWebhookDto): Promise<WebResponse<null>> {
    if (!payload.signature_key) {
      throw new BadRequestException('Missing signature_key in payload');
    }
    await this.webhookService.midtransWebhook(payload);
    return webResponse(200, 'Webhook processed successfully');
  }
}
