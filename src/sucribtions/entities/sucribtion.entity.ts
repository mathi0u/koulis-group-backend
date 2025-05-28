import { Client } from 'src/clients/entities/client.entity'
import { Payment } from 'src/payments/entities/payment.entity'
import { Program } from 'src/programs/entities/program.entity'
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm'

export enum SubscriptionType {
    PER_YEAR = 'ANNUELLE',
    PER_MONTH = 'MENSUELLE',
    PER_SESSION = 'SEANCE',
    PER_WEEK = 'HEBDOMADAIRE',
}

export enum SubscriptionStatus {
    ACTIVE = 'ACTIVE',
    EXPIRED = 'EXPIRED',
}

export enum ProgramLevel {
    BEGINNER = 'DEBUTANT',
    INTERMEDIATE = 'INTERMEDIAIRE',
    ADVANCED = 'AVANCE',
}

@Entity()
export class Subscription {
    @PrimaryGeneratedColumn()
    subscription_id: number

    @Column({
        type: 'enum',
        enum: SubscriptionType,
        default: SubscriptionType.PER_MONTH,
    })
    subscription_type: SubscriptionType

    @ManyToOne(() => Client, (client) => client.subscriptions)
    client: Client

    @ManyToOne(() => Program, (program) => program.subscriptions)
    program: Program

    @Column({
        type: 'enum',
        enum: ProgramLevel,
        default: ProgramLevel.BEGINNER,
    })
    program_level: ProgramLevel

    @OneToMany(() => Payment, (payment) => payment.subscription)
    payments: Payment[]

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
    })
    start_date: Date

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
    })
    end_date: Date

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
    })
    registration_date: Date

    @Column({
        type: 'enum',
        enum: SubscriptionStatus,
        default: SubscriptionStatus.ACTIVE,
    })
    status: SubscriptionStatus

    @Column({ nullable: true })
    discount: number
}
