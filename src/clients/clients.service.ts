import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Client } from './entities/client.entity'
import { Repository } from 'typeorm'
import { CreateClientDto } from './dto/create-client.dto'
import { UpdateClientDto } from './dto/update-client.dto'

@Injectable()
export class ClientsService {
    constructor(
        @InjectRepository(Client)
        private readonly client_repository: Repository<Client>,
    ) {}

    async create(createClientDto: CreateClientDto) {
        const new_user = this.client_repository.create(createClientDto)
        return await this.client_repository.save(new_user)
    }

    async findAll() {
        const clients = await this.client_repository.find({
            relations: {
                subscriptions: true,
            },
            select: {
                subscriptions: {
                    subscription_id: true,
                    subscription_type: true,
                    start_date: true,
                    end_date: true,
                    program_level: true,
                },
            },
            order: {
                updated_at: 'DESC',
            },
        })

        return clients.map((client) => ({
            ...client,
            subscriptions:
                client.subscriptions.length > 0
                    ? [{ subscription_id: client.subscriptions.reverse()[0].subscription_id }]
                    : [],
        }))
    }

    async findOne(id: number) {
        const user = await this.client_repository.findOneBy({
            client_id: id,
        })

        if (!user) throw new NotFoundException('User has not been found !')

        return user
    }

    async findByEmail(email: string) {
        const client = await this.client_repository.findOneBy({
            email: email,
        })

        if (!client) {
            throw new NotFoundException(`Client with email ${email} not found`)
        }

        return client
    }

    update(id: number, updateClientDto: UpdateClientDto) {
        return this.client_repository.update(
            {
                client_id: id,
            },
            updateClientDto,
        )
    }

    remove(id: number) {
        this.client_repository.softRemove({ client_id: id })
    }
}
