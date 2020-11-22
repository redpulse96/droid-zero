import { Body, Controller, Post } from '@nestjs/common';
import { BackendLogger } from '../logger/BackendLogger';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  private readonly log = new BackendLogger(PaymentsController.name);

  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('/register')
  // @UseGuards(AuthGuard)
  public registerCategory(
    @Body('amount') amount: number,
    @Body('notes') notes: string,
    @Body('payment_id') payment_id?: string,
  ) {
    this.log.info('registerCategory.category_items');
    return this.paymentsService.createPaymentInstance({
      amount,
      notes,
      payment_id,
    });
  }
}
