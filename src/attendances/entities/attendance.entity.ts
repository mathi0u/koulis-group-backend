// src/entities/attendance.entity.ts
import { Client } from 'src/clients/entities/client.entity'
import { Coach } from 'src/coaches/entities/coach.entity'
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'

@Entity()
export class Attendance {
    @PrimaryGeneratedColumn()
    attendance_id: number

    @ManyToOne(() => Client, (client) => client.attendances)
    client: Client

    @ManyToOne(() => Coach, (coach) => coach.attendances, { nullable: true })
    coach: Coach

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
    })
    date_time: Date
}
