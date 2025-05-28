import { Client } from 'src/clients/entities/client.entity'
import { Coach } from 'src/coaches/entities/coach.entity'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

export enum SucribtionCardStatus {
    LOST = 'LOST',
    ACTIVE = 'ACTIVE',
    NOT_DELIVERED = 'NOT_DELIVERED',
}

@Entity()
export class SucribtionCard {
    @PrimaryGeneratedColumn() card_id: number

    @ManyToOne(() => Client, (client) => client.cards, { nullable: true })
    client: Client

    @ManyToOne(() => Coach, (coach) => coach.cards, { nullable: true })
    coach: Coach

    @Column({ type: 'text' })
    qr_code: string

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
    })
    issuance_date: Date

    @Column({
        type: 'enum',
        enum: SucribtionCardStatus,
        default: SucribtionCardStatus.NOT_DELIVERED,
    })
    status: SucribtionCardStatus

    @Column({
        type: 'int',
        default: 5000,
    })
    renewal_fee: number
}
