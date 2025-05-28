import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import { ConfigsModule } from './configs/configs.module'
import { UsersModule } from './users/users.module'
import { HealthModule } from './health/health.module'

@Module({
    imports: [ConfigsModule, UsersModule, HealthModule, TypeOrmModule.forFeature([])],
    controllers: [],
    providers: [],
})
export class AppModule {}
