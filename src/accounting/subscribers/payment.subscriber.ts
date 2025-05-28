import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntitySubscriberInterface, InsertEvent, DataSource } from 'typeorm';
import { Payment } from 'src/payments/entities/payment.entity';
import { Accounting } from '../entities/accounting.entity';
import { AccountingType } from '../entities/accounting.entity';

@Injectable()
export class PaymentSubscriber implements EntitySubscriberInterface<Payment> {
    constructor(
        @InjectRepository(Accounting)
        private accountingRepository: Repository<Accounting>,
        dataSource: DataSource,
    ) {
        dataSource.subscribers.push(this);
    }

    listenTo() {
        return Payment;
    }

    async afterInsert(event: InsertEvent<Payment>) {
        try {
            // Ensure the payment entity is fully loaded with relations
            const payment = await event.manager.findOne(Payment, {
                where: { payment_id: event.entity.payment_id },
                relations: ['subscription', 'product'],
            });

            if (!payment) {
                console.error('Payment not found during afterInsert in PaymentSubscriber');
                return;
            }

            // Create accounting entry for subscription or product
            const accounting = new Accounting();
            accounting.type = AccountingType.INCOME;
            accounting.amount = payment.amount;
            accounting.payment = payment;
            accounting.description = this.generateDescription(payment);

            await this.accountingRepository.save(accounting);
        } catch (error) {
            console.error('Error creating accounting entry in PaymentSubscriber:', error);
        }
    }

    private generateDescription(payment: Payment): string {
        if (payment.subscription) {
            return `Payment for subscription #${payment.subscription.subscription_id}`;
        }
        if (payment.product) {
            return `Payment for product ${payment.product.name}`;
        }
        return 'Payment received';
    }
}
