import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import { ConfigsModule } from './configs/configs.module'
import { UsersModule } from './users/users.module'
import { HealthModule } from './health/health.module'
import { SucribtionsModule } from './sucribtions/sucribtions.module'
import { ClientsModule } from './clients/clients.module'
import { PaymentsModule } from './payments/payments.module'
import { ProductsModule } from './products/products.module'
import { AccountingModule } from './accounting/accounting.module'
import { ServicesModule } from './services/services.module'
import { ProgramsModule } from './programs/programs.module'
import { InventoryModule } from './inventory/inventory.module'

@Module({
    imports: [
        ConfigsModule,
        UsersModule,
        HealthModule,
        TypeOrmModule.forFeature([]),
        SucribtionsModule,
        ClientsModule,
        PaymentsModule,
        ProductsModule,
        AccountingModule,
        ServicesModule,
        ProgramsModule,
        InventoryModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
