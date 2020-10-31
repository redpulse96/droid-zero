import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Razorpay from 'razorpay';
import { BaseService } from 'src/base.service';
import { InterfaceList } from 'src/shared/constants';
import { Utils } from 'src/shared/util';
import { Repository } from 'typeorm';
import { DotenvService } from '../dotenv/dotenv.service';
import { BackendLogger } from '../logger/BackendLogger';
import { CreatePaymentDto } from './dto/payments-input.dto';
import { Payments } from './payments.entity';
const { executePromise, returnCatchFunction } = Utils;
@Injectable()
export class PaymentsService extends BaseService<Payments> {
  private readonly log = new BackendLogger(PaymentsService.name);

  constructor(
    @InjectRepository(Payments)
    private readonly paymentRepo: Repository<Payments>,
    private readonly dotenvService: DotenvService,
  ) {
    super(paymentRepo);
  }

  private RazorPayInstance = new Razorpay({
    key_id: this.dotenvService.get('RAZORPAY_KEY_ID'),
    key_secret: this.dotenvService.get('RAZORPAY_KEY_SECRET'),
  });

  public async createPaymentInstance(
    payment_instance_input: CreatePaymentDto,
  ): Promise<InterfaceList.BooleanResponse> {
    const { notes, amount, payment_id } = payment_instance_input;
    try {
      const pay = await this.RazorPayInstance.orders.create({
        amount,
        notes,
        currency: 'INR',
      });
      this.log.debug(pay);
      const razorpay_instance = await this.RazorPayInstance.payments.fetch(
        payment_id,
      );
      const payment_instance: Payments = {
        entity: razorpay_instance.entity,
        payment_id: razorpay_instance.payment_id,
        currency: razorpay_instance.currency,
        amount: razorpay_instance.amount,
        description: razorpay_instance.description,
        email: razorpay_instance.email,
        contact: razorpay_instance.contact,
        bank: razorpay_instance.bank,
        method: razorpay_instance.method,
        order_id: razorpay_instance.order_id,
        status: razorpay_instance.status,
      };
      this.log.info('payment_instance');
      this.log.debug(razorpay_instance);
      const [payment_error, payment]: [
        any,
        Promise<Payments>,
      ] = await executePromise(this.create(payment_instance));
      if (payment_error) {
        this.log.error('payment_error', payment_error);
        const refund_input: any = { amount, notes };
        await this.RazorPayInstance.payments.refund(payment_id, refund_input);
        return { success: false };
      } else if (!payment) {
        this.log.info('payment.not.created');
        const refund_input: any = { amount, notes };
        await this.RazorPayInstance.payments.refund(payment_id, refund_input);
        return { success: false };
      }
      this.log.info('payment');
      this.log.debug(payment);
      if (razorpay_instance?.captured) {
        this.log.info('payment.captured_true');
        return { success: true, data: { payment_id } };
      } else {
        this.log.info('payment.captured_false');
        return { success: false };
      }
    } catch (error) {
      this.log.error('payment.catch.error', error);
      const refund_input: any = { amount, notes };
      await this.RazorPayInstance.payments.refund(payment_id, refund_input);
      return { success: false };
    }
  }
}
