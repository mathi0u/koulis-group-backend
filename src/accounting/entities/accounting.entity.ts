// src/entities/accounting.entity.ts
import { Payment } from 'src/payments/entities/payment.entity'
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'

export enum AccountingType {
    INCOME = 'income',
    EXPENSE = 'expense',
}

@Entity()
export class Accounting {
    @PrimaryGeneratedColumn()
    transaction_id: number

    @ManyToOne(() => Payment, { nullable: false })
    @JoinColumn({ name: 'paymentPaymentId' })
    payment: Payment

    @Column({
        type: 'enum',
        enum: AccountingType,
    })
    type: AccountingType

    @Column({
        type: 'int',
        default: 0,
    })
    amount: number

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
    })
    date: Date

    @Column({
        type: 'text',
        nullable: true,
    })
    description: string
}
