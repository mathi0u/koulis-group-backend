import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateServiceDto } from './dto/create-service.dto'
import { UpdateServiceDto } from './dto/update-service.dto'
import { Service } from './entities/service.entity'

@Injectable()
export class ServicesService {
    constructor(
        @InjectRepository(Service)
        private servicesRepository: Repository<Service>,
    ) {}

    async create(createServiceDto: CreateServiceDto) {
        const service = this.servicesRepository.create(createServiceDto)
        return await this.servicesRepository.save(service)
    }

    async findAll() {
        return await this.servicesRepository.find()
    }

    async findOne(id: number) {
        const service = await this.servicesRepository.findOne({ where: { service_id: id } })
        if (!service) {
            throw new NotFoundException(`Service with ID ${id} not found`)
        }
        return service
    }

    async update(id: number, updateServiceDto: UpdateServiceDto) {
        const service = await this.findOne(id)
        Object.assign(service, updateServiceDto)
        return await this.servicesRepository.save(service)
    }

    async remove(id: number) {
        const service = await this.findOne(id)
        if (!service) throw new NotFoundException('Service not found')

        return await this.servicesRepository.remove(service)
    }
}
