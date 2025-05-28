import { Client } from 'src/clients/entities/client.entity'
import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'

@Entity()
export class Discount {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Client, (client) => client.discounts)
    client: Client
}
