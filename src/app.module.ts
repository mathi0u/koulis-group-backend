import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import { ConfigsModule } from './configs/configs.module'
import { UsersModule } from './users/users.module'

@Module({
    imports: [ConfigsModule, UsersModule, TypeOrmModule.forFeature([])],
    controllers: [],
    providers: [],
})
export class AppModule {}
