import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SucribtionsService } from './sucribtions.service'
import { SucribtionsController } from './sucribtions.controller'
import { Subscription } from './entities/sucribtion.entity'
import { ClientsModule } from '../clients/clients.module'
import { ProgramsModule } from '../programs/programs.module'
import { PaymentsModule } from '../payments/payments.module'
import { AccountingModule } from '../accounting/accounting.module'
import { Accounting } from '../accounting/entities/accounting.entity'

@Module({
    imports: [
        TypeOrmModule.forFeature([Subscription, Accounting]),
        ClientsModule,
        ProgramsModule,
        PaymentsModule,
        AccountingModule,
    ],
    controllers: [SucribtionsController],
    providers: [SucribtionsService],
})
export class SucribtionsModule {}
