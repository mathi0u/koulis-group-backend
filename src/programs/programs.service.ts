import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateProgramDto } from './dto/create-program.dto'
import { UpdateProgramDto } from './dto/update-program.dto'
import { Program } from './entities/program.entity'
import { ServicesService } from 'src/services/services.service'

@Injectable()
export class ProgramsService {
    constructor(
        @InjectRepository(Program)
        private readonly programRepository: Repository<Program>,
        private readonly serviceService: ServicesService,
    ) {}

    async create(createProgramDto: CreateProgramDto) {
        const program = this.programRepository.create(createProgramDto)
        const service = await this.serviceService.findOne(createProgramDto.service_id)

        if (!service) {
            throw new NotFoundException(`Service with ID ${createProgramDto.service_id} not found`)
        }

        program.service = service

        return await this.programRepository.save(program)
    }

    async findAll() {
        return await this.programRepository.find({
            relations: {
                service: true,
            },
            select: {
                service: {
                    name: true,
                },
            },
        })
    }

    async findOne(id: number) {
        const program = await this.programRepository.findOne({
            where: { program_id: id },
            relations: {
                service: true,
            },
            select: {
                service: {
                    name: true,
                },
            },
        })

        if (!program) {
            throw new NotFoundException(`Program with ID ${id} not found`)
        }

        return program
    }

    async update(id: number, updateProgramDto: UpdateProgramDto) {
        const program = await this.findOne(id)
        this.programRepository.merge(program, updateProgramDto)
        return await this.programRepository.save(program)
    }

    async remove(id: number): Promise<void> {
        const program = await this.findOne(id)
        await this.programRepository.remove(program)
    }
}
