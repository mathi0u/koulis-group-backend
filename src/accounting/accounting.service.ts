import { Injectable, NotFoundException } from '@nestjs/common'
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
        const payment = await this.paymentRepository.findOneBy({
            payment_id: createAccountingDto.payment_id,
        })

        if (!payment) {
            throw new NotFoundException(`Payment with ID ${createAccountingDto.payment_id} not found`)
        }

        const accounting = this.accountingRepository.create({
            ...createAccountingDto,
            payment,
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
            relations: ['payment'],
        })

        if (!accounting) {
            throw new NotFoundException(`Accounting entry with ID ${id} not found`)
        }

        return accounting
    }

    async update(id: number, updateAccountingDto: UpdateAccountingDto) {
        const accounting = await this.findOne(id)
        this.accountingRepository.merge(accounting, updateAccountingDto)
        return await this.accountingRepository.save(accounting)
    }

    async remove(id: number) {
        const accounting = await this.findOne(id)
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
