import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateAccountingDto } from './dto/create-accounting.dto'
import { UpdateAccountingDto } from './dto/update-accounting.dto'
import { Accounting } from './entities/accounting.entity'
import { Payment } from 'src/payments/entities/payment.entity'

@Injectable()
export class AccountingService {
    constructor(
        @InjectRepository(Accounting)
        private accountingRepository: Repository<Accounting>,
        @InjectRepository(Payment)
        private paymentRepository: Repository<Payment>,
    ) {}

    async create(createAccountingDto: CreateAccountingDto) {
        // Create the payment entity from user-provided data
        // This payment can be completely independent of any existing entities in the system
        const paymentData: Partial<Payment> = {
            payment_method: createAccountingDto.payment.payment_method,
            amount: createAccountingDto.payment.amount,
            payment_date: createAccountingDto.payment.payment_date || new Date(),
        }

        // Note: subscription_id and product_id are ignored here since we're allowing
        // payments that are not related to any entities in the system
        // If you need to link to existing entities, that would be handled separately

        // Create and save the payment
        const payment = this.paymentRepository.create(paymentData)
        const savedPayment = await this.paymentRepository.save(payment)

        // Create the accounting entry
        const accounting = this.accountingRepository.create({
            type: createAccountingDto.type,
            amount: createAccountingDto.amount,
            description:
                createAccountingDto.description ||
                createAccountingDto.payment.external_reference ||
                'Paiement externe non suivi par le système',
            payment: savedPayment,
        })

        return await this.accountingRepository.save(accounting)
    }

    async findAll() {
        return await this.accountingRepository.find({
            relations: { payment: true },
            order: {
                date: 'DESC',
            },
        })
    }

    async findOne(id: number) {
        if (!Number.isInteger(id) || id <= 0) {
            throw new NotFoundException(`Invalid ID: ${id}`)
        }

        const accounting = await this.accountingRepository.findOne({
            where: { transaction_id: id },
            relations: {
                payment: {
                    subscription: true,
                    product: true,
                },
            },
        })

        if (!accounting) {
            throw new NotFoundException(`Accounting entry with ID ${id} not found`)
        }

        return accounting
    }

    private isSystemManagedPayment(accounting: Accounting): boolean {
        return !!(accounting.payment?.subscription || accounting.payment?.product)
    }

    async update(id: number, updateAccountingDto: UpdateAccountingDto) {
        const accounting = await this.findOne(id)

        if (this.isSystemManagedPayment(accounting)) {
            throw new ForbiddenException(
                'Cannot update accounting entries related to subscriptions or products. These are managed by the system.',
            )
        }

        this.accountingRepository.merge(accounting, updateAccountingDto)
        return await this.accountingRepository.save(accounting)
    }

    async remove(id: number) {
        const accounting = await this.findOne(id)

        if (this.isSystemManagedPayment(accounting)) {
            throw new ForbiddenException(
                'Cannot delete accounting entries related to subscriptions or products. These are managed by the system.',
            )
        }

        return await this.accountingRepository.remove(accounting)
    }

    async findAllTransactions() {
        return await this.accountingRepository.find({
            relations: {
                payment: {
                    subscription: {
                        client: true,
                    },
                    product: true,
                },
            },
        })
    }
}
