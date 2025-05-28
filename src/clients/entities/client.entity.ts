import { Attendance } from 'src/attendances/entities/attendance.entity'
import { Discount } from 'src/discounts/entities/discount.entity'
import { Reservation } from 'src/reservation/entities/reservation.entity'
import { SucribtionCard } from 'src/sucribtion-cards/entities/sucribtion-card.entity'
import { Subscription } from 'src/sucribtions/entities/sucribtion.entity'
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { BaseEntity } from './base.entity'

export enum BloodGroup {
    A_POSITIVE = 'A_POSITIVE',
    A_NEGATIVE = 'A_NEGATIVE',
    B_POSITIVE = 'B_POSITIVE',
    B_NEGATIVE = 'B_NEGATIVE',
    O_POSITIVE = 'O_POSITIVE',
    O_NEGATIVE = 'O_NEGATIVE',
    AB_POSITIVE = 'AB_POSITIVE',
    AB_NEGATIVE = 'AB_NEGATIVE',
}

@Entity()
export class Client extends BaseEntity {
    @PrimaryGeneratedColumn()
    client_id: number

    @Column({ type: 'varchar' })
    first_name: string

    @Column({ type: 'varchar' })
    last_name: string

    @Column({ type: 'varchar' })
    address: string

    @Column({
        type: 'varchar', // Changed from 'int' to 'varchar'
        length: 20,
    })
    phone: string

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
    })
    date_of_birth: Date

    @Column({
        type: 'varchar',
    })
    email: string

    @Column({
        type: 'varchar',
    })
    urgent_contact_full_name: string

    @Column({
        type: 'varchar', // Changed from 'int' to 'varchar'
        length: 20,
    })
    urgent_contact_phone: string

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
    })
    registration_date: Date

    @Column({
        type: 'enum',
        enum: BloodGroup,
    })
    blood_group: BloodGroup

    @OneToMany(() => Subscription, (subscription: Subscription) => subscription.client)
    subscriptions: Subscription[]

    @OneToMany(() => Reservation, (reservation: Reservation) => reservation.client, { nullable: true })
    reservations: Reservation[]

    @OneToMany(() => Discount, (discount: Discount) => discount.client, { nullable: true })
    discounts: Discount[]

    @OneToMany(() => Attendance, (attendance: Attendance) => attendance.client, { nullable: true })
    attendances: Attendance[]

    @OneToMany(() => SucribtionCard, (card: SucribtionCard) => card.client)
    cards: SucribtionCard[]
}
