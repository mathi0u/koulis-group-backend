import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreatePaymentDto } from './dto/create-payment.dto'
import { UpdatePaymentDto } from './dto/update-payment.dto'
import { Payment } from './entities/payment.entity'
import { Accounting } from 'src/accounting/entities/accounting.entity'
import { AccountingType } from 'src/accounting/entities/accounting.entity'

@Injectable()
export class PaymentsService {
    constructor(
        @InjectRepository(Payment)
        private readonly paymentRepository: Repository<Payment>,
        @InjectRepository(Accounting)
        private readonly accountingRepository: Repository<Accounting>,
    ) {}

    async create(createPaymentDto: CreatePaymentDto) {
        const payment = this.paymentRepository.create(createPaymentDto)
        const savedPayment = await this.paymentRepository.save(payment)

        // Create accounting entry
        const accounting = new Accounting()
        accounting.type = AccountingType.INCOME
        accounting.amount = savedPayment.amount
        accounting.payment = savedPayment
        accounting.description = this.generateDescription(savedPayment)

        await this.accountingRepository.save(accounting)

        return savedPayment
    }

    async findAll() {
        return await this.paymentRepository.find({
            relations: ['subscription'],
        })
    }

    async findOne(id: number) {
        const payment = await this.paymentRepository.findOne({
            where: { payment_id: id },
            relations: ['subscription'],
        })

        if (!payment) {
            throw new NotFoundException(`Payment with ID ${id} not found`)
        }

        return payment
    }

    async update(id: number, updatePaymentDto: UpdatePaymentDto) {
        const payment = await this.findOne(id)
        this.paymentRepository.merge(payment, updatePaymentDto)
        return await this.paymentRepository.save(payment)
    }

    async remove(id: number) {
        const payment = await this.findOne(id)
        return await this.paymentRepository.remove(payment)
    }

    private generateDescription(payment: Payment): string {
        if (payment.subscription) {
            return `Payment for subscription #${payment.subscription.subscription_id}`
        }
        if (payment.product) {
            return `Payment for product ${payment.product.name}`
        }
        return 'Payment received'
    }
}
