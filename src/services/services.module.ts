import { Module } from '@nestjs/common'
import { ServicesService } from './services.service'
import { ServicesController } from './services.controller'
import { Service } from './entities/service.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
    imports: [TypeOrmModule.forFeature([Service])],
    controllers: [ServicesController],
    providers: [ServicesService],
    exports: [ServicesService],
})
export class ServicesModule {}
