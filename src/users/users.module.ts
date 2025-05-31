import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { AdminSeederService } from './admin-seeder.service'
import { User } from './entities/user.entity'

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UsersController],
    providers: [UsersService, AdminSeederService],
    exports: [UsersService],
})
export class UsersModule {}
