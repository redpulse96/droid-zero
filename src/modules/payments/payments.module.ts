import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsController } from './payments.controller';
import { Payments } from './payments.entity';
import { PaymentsService } from './payments.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Payments])],
  providers: [PaymentsService],
  controllers: [PaymentsController],
  exports: [PaymentsService],
})
export class PaymentsModule {}
