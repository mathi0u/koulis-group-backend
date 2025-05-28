import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateSucribtionDto } from './dto/create-sucribtion.dto'
import { UpdateSucribtionDto } from './dto/update-sucribtion.dto'
import { Subscription, SubscriptionType } from './entities/sucribtion.entity'
import { ClientsService } from '../clients/clients.service'
import { ProgramsService } from '../programs/programs.service'
import { PaymentsService } from '../payments/payments.service'
import { CreateClientDto } from 'src/clients/dto/create-client.dto'
import { Program } from 'src/programs/entities/program.entity'
import { CreatePaymentDto } from 'src/payments/dto/create-payment.dto'
import { Accounting } from '../accounting/entities/accounting.entity'
import { AccountingType } from '../accounting/entities/accounting.entity'

@Injectable()
export class SucribtionsService {
    constructor(
        @InjectRepository(Subscription)
        private readonly subscriptionRepository: Repository<Subscription>,
        @InjectRepository(Accounting)
        private readonly accountingRepository: Repository<Accounting>,
        private readonly clientsService: ClientsService,
        private readonly programsService: ProgramsService,
        private readonly paymentsService: PaymentsService,
    ) {}

    private calculateEndDate(startDate: Date, subscriptionType: SubscriptionType): Date {
        const endDate = new Date(startDate)

        switch (subscriptionType) {
            case SubscriptionType.PER_YEAR:
                endDate.setFullYear(endDate.getFullYear() + 1)
                break
            case SubscriptionType.PER_MONTH:
                endDate.setMonth(endDate.getMonth() + 1)
                break
            case SubscriptionType.PER_WEEK:
                endDate.setDate(endDate.getDate() + 7)
                break
            case SubscriptionType.PER_SESSION:
                endDate.setDate(endDate.getDate() + 1)
                break
            default:
                throw new BadRequestException('Invalid subscription type')
        }

        return endDate
    }

    private async validateSubscriptionData(dto: CreateSucribtionDto) {
        const program = await this.programsService.findOne(dto.program_id)
        if (!program) {
            throw new NotFoundException(`Program with ID ${dto.program_id} not found`)
        }

        const today = new Date()
        if (dto.start_date < today) {
            throw new BadRequestException('Start date cannot be in the past')
        }

        return { program }
    }

    private async createOrFindClient(clientDto: CreateClientDto) {
        try {
            // Try to find existing client
            const existingClient = await this.clientsService.findByEmail(clientDto.email)
            return existingClient
        } catch (error) {
            if (error instanceof NotFoundException) {
                // If client not found, create new one
                return await this.clientsService.create(clientDto)
            }
        }
        throw new BadRequestException('Error creating or finding client')
    }

    private async createSubscriptionEntity(dto: CreateSucribtionDto, client: CreateClientDto, program: Program) {
        const endDate = this.calculateEndDate(dto.start_date, dto.subscription_type)

        return this.subscriptionRepository.create({
            subscription_type: dto.subscription_type,
            program_level: dto.program_level,
            start_date: dto.start_date,
            end_date: endDate,
            client,
            program,
        })
    }

    async create(dto: CreateSucribtionDto) {
        // Validate subscription data
        const { program } = await this.validateSubscriptionData(dto)

        // Create or find client
        const client = await this.createOrFindClient(dto.client)

        // Create subscription entity
        const subscription = await this.createSubscriptionEntity(dto, client, program)

        // Save subscription
        const savedSubscription = await this.subscriptionRepository.save(subscription)

        // Create payment
        const payment = await this.paymentsService.create({
            ...dto.payment,
            subscription: savedSubscription,
        })

        // Create accounting entry
        const accounting = new Accounting()
        accounting.type = AccountingType.INCOME
        accounting.amount = payment.amount
        accounting.payment = payment
        accounting.description = `Payment for subscription #${savedSubscription.subscription_id}`

        await this.accountingRepository.save(accounting)

        return savedSubscription
    }

    async findAll() {
        return await this.subscriptionRepository.find({
            relations: ['client', 'program', 'payments'],
            order: { start_date: 'DESC' },
        })
    }

    async findOne(id: number) {
        const subscription = await this.subscriptionRepository.findOne({
            where: { subscription_id: id },
            relations: ['client', 'program', 'payments'],
        })

        if (!subscription) {
            throw new NotFoundException(`Subscription with ID ${id} not found`)
        }

        return subscription
    }

    async update(id: number, dto: UpdateSucribtionDto) {
        const subscription = await this.findOne(id)

        // Merge and save changes
        const updated = this.subscriptionRepository.merge(subscription, dto)
        return await this.subscriptionRepository.save(updated)
    }

    async remove(id: number) {
        const subscription = await this.findOne(id)
        return await this.subscriptionRepository.remove(subscription)
    }

    private async findLastSubscriptionByClientId(clientId: number) {
        const subscription = await this.subscriptionRepository.findOne({
            where: { client: { client_id: clientId } },
            relations: ['client', 'program', 'payments'],
            order: { subscription_id: 'DESC' },
        })

        if (!subscription) {
            throw new NotFoundException(`No subscription found for client with ID ${clientId}`)
        }

        return subscription
    }

    async renew(clientId: number, payment: CreatePaymentDto) {
        // Find client's last subscription
        const lastSubscription = await this.findLastSubscriptionByClientId(clientId)

        // Calculate new start date based on current subscription end
        const newStartDate = new Date()
        newStartDate.setDate(newStartDate.getDate() + 1) // Start from tomorrow

        // Calculate end date based on subscription type
        const endDate = this.calculateEndDate(newStartDate, lastSubscription.subscription_type)

        // Create new subscription with same details
        const newSubscription = this.subscriptionRepository.create({
            subscription_type: lastSubscription.subscription_type,
            program_level: lastSubscription.program_level,
            start_date: newStartDate,
            end_date: endDate,
            client: lastSubscription.client,
            program: lastSubscription.program,
        })

        // Save new subscription
        const savedSubscription = await this.subscriptionRepository.save(newSubscription)

        // Create payment for renewal
        await this.paymentsService.create({
            ...payment,
            subscription: savedSubscription,
        })

        return savedSubscription
    }
}
