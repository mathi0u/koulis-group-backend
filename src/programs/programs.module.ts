import { Module } from '@nestjs/common'
import { ProgramsService } from './programs.service'
import { ProgramsController } from './programs.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Program } from './entities/program.entity'
import { ServicesModule } from 'src/services/services.module'

@Module({
    imports: [TypeOrmModule.forFeature([Program]), ServicesModule],
    controllers: [ProgramsController],
    providers: [ProgramsService],
    exports: [ProgramsService], // Add this line
})
export class ProgramsModule {}
