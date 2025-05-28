// src/entities/coach.entity.ts
import { Attendance } from 'src/attendances/entities/attendance.entity'
import { SucribtionCard } from 'src/sucribtion-cards/entities/sucribtion-card.entity'
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'

@Entity()
export class Coach {
    @PrimaryGeneratedColumn()
    coach_id: number

    @Column({
        type: 'text',
    })
    first_name: string

    @Column({
        type: 'text',
    })
    last_name: string

    @Column({
        type: 'text',
    })
    address: string

    @Column({
        type: 'numeric',
    })
    phone: string

    @Column({
        type: 'text',
    })
    email: string

    @OneToMany(() => SucribtionCard, (card) => card.client)
    cards: SucribtionCard[]

    @OneToMany(() => Attendance, (attendance) => attendance.coach)
    attendances: Attendance[]
}
