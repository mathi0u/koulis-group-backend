// src/entities/inventory.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Inventory {
    @PrimaryGeneratedColumn()
    material_id: number

    @Column({
        type: 'text',
    })
    name: string

    @Column({
        type: 'int',
        default: 0,
    })
    available_quantity: number

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
    })
    acquisition_date: Date

    @Column({
        type: 'enum',
        enum: ['functional', 'under_repair'],
    })
    condition: string // 'functional' or 'under repair'
}
