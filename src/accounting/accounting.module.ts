import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AccountingService } from './accounting.service'
import { AccountingController } from './accounting.controller'
import { Accounting } from './entities/accounting.entity'
import { Payment } from '../payments/entities/payment.entity'
import { PaymentSubscriber } from './subscribers/payment.subscriber'

@Module({
    imports: [TypeOrmModule.forFeature([Accounting, Payment])],
    controllers: [AccountingController],
    providers: [AccountingService, PaymentSubscriber],
    exports: [AccountingService, TypeOrmModule],
})
export class AccountingModule {}
