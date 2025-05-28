import { Module } from '@nestjs/common'
import { UsersModule } from './users/users.module'
import { ServicesModule } from './services/services.module'
import { SucribtionsModule } from './sucribtions/sucribtions.module'
import { ProgramsModule } from './programs/programs.module'
import { ProductsModule } from './products/products.module'
import { InventoryModule } from './inventory/inventory.module'
import { ClientsModule } from './clients/clients.module'
import { PaymentsModule } from './payments/payments.module'
import { AccountingModule } from './accounting/accounting.module'
import { ReservationModule } from './reservation/reservation.module'
import { CoachesModule } from './coaches/coaches.module'
import { SucribtionCardsModule } from './sucribtion-cards/sucribtion-cards.module'
import { PartnersModule } from './partners/partners.module'
import { DiscountsModule } from './discounts/discounts.module'
import { AttendancesModule } from './attendances/attendances.module'
import { ConfigsModule } from './configs/configs.module'
import { HealthController } from './health.controller'

@Module({
    imports: [
        ConfigsModule,
        UsersModule,
        ServicesModule,
        SucribtionsModule,
        ProgramsModule,
        ProductsModule,
        InventoryModule,
        ClientsModule,
        PaymentsModule,
        AccountingModule,
        ReservationModule,
        CoachesModule,
        SucribtionCardsModule,
        PartnersModule,
        DiscountsModule,
        AttendancesModule,
    ],
    controllers: [HealthController],
    providers: [],
})
export class AppModule {}
