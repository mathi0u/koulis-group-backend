import { Accounting } from 'src/accounting/entities/accounting.entity'
import { Product } from 'src/products/entities/product.entity'
import { Subscription } from 'src/sucribtions/entities/sucribtion.entity'
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, OneToMany } from 'typeorm'

export enum PaymentMethod {
    CASH = 'CASH',
    MOBILE_MONEY = 'MOBILE_MONEY',
}

@Entity()
export class Payment {
    @PrimaryGeneratedColumn()
    payment_id: number

    @ManyToOne(() => Subscription, (subscription) => subscription.payments, {
        nullable: true,
        eager: true, // Add this to automatically load subscription
    })
    subscription: Subscription

    @ManyToOne(() => Product, (product) => product.payments, {
        nullable: true,
        eager: true, // Add this to automatically load product
    })
    product: Product

    @Column({
        type: 'numeric',
    })
    amount: number

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
    })
    payment_date: Date

    @Column({
        type: 'enum',
        enum: PaymentMethod,
    })
    payment_method: PaymentMethod

    @OneToMany(() => Accounting, (accounting) => accounting.payment)
    accountings: Accounting[]
}
