import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, EntitySubscriberInterface, InsertEvent, DataSource } from 'typeorm'
import { Payment } from 'src/payments/entities/payment.entity'
import { Accounting } from '../entities/accounting.entity'
import { AccountingType } from '../entities/accounting.entity'

@Injectable()
export class PaymentSubscriber implements EntitySubscriberInterface<Payment> {
    constructor(
        @InjectRepository(Accounting)
        private accountingRepository: Repository<Accounting>,
        dataSource: DataSource,
    ) {
        dataSource.subscribers.push(this)
    }

    listenTo() {
        return Payment
    }

    async afterInsert(event: InsertEvent<Payment>) {
        try {
            // Ensure the payment entity is fully loaded with relations
            const payment = await event.manager.findOne(Payment, {
                where: { payment_id: event.entity.payment_id },
                relations: ['subscription', 'product'],
            })

            if (!payment) {
                console.error('Payment not found during afterInsert in PaymentSubscriber')
                return
            }

            // Only create accounting entries for payments related to subscriptions or products
            // Independent payments created through the accounting service should not trigger this
            if (!payment.subscription && !payment.product) {
                // This is an independent payment created through the accounting service
                // Skip automatic accounting entry creation
                return
            }

            // Check if an accounting entry already exists for this payment
            const existingAccounting = await event.manager.findOne(Accounting, {
                where: { payment: { payment_id: payment.payment_id } },
            })

            if (existingAccounting) {
                // Accounting entry already exists, skip creation
                return
            }

            // Create accounting entry for subscription or product payments only
            const accounting = new Accounting()
            accounting.type = AccountingType.INCOME
            accounting.amount = payment.amount
            accounting.payment = payment
            accounting.description = this.generateDescription(payment)

            await event.manager.save(accounting)
        } catch (error) {
            console.error('Error creating accounting entry in PaymentSubscriber:', error)
        }
    }

    private generateDescription(payment: Payment): string {
        if (payment.subscription) {
            return `Paiement pour l'abonnement #${payment.subscription.subscription_id}`
        }
        if (payment.product) {
            return `Paiement pour le produit ${payment.product.name}`
        }
        return 'Paiement reçu'
    }
}
