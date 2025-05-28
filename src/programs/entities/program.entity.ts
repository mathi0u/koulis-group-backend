import { Service } from 'src/services/entities/service.entity'
import { Subscription } from 'src/sucribtions/entities/sucribtion.entity'
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm'

@Entity()
export class Program {
    @PrimaryGeneratedColumn()
    program_id: number

    @ManyToOne(() => Service, (service) => service.programs)
    service: Service

    @Column({ type: 'varchar' })
    name: string

    @Column({ type: 'text' })
    description: string

    @OneToMany(() => Subscription, (subscription) => subscription.program)
    subscriptions: Subscription[]

    @Column({ type: 'int' })
    price: number
}
