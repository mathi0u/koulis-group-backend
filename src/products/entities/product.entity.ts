import { BaseEntity } from 'src/clients/entities/base.entity'
import { Payment } from 'src/payments/entities/payment.entity'
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'

export enum ProductType {
    SALE_PRODUCT = 'SALE_PRODUCT',
    RENTAL_PRODUCT = 'RENTAL_PRODUCT',
}

@Entity()
export class Product extends BaseEntity {
    @PrimaryGeneratedColumn()
    product_id: number

    @Column({
        type: 'varchar',
    })
    name: string

    @Column({
        type: 'enum',
        enum: ProductType,
    })
    type: ProductType

    @Column({
        type: 'int',
        default: 0,
    })
    available_quantity: number

    @Column({
        type: 'int',
    })
    unit_price: number

    // TODO: should define a special sell entity
    @OneToMany(() => Payment, (payment) => payment.product)
    payments: Payment[]
}
