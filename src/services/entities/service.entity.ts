import { BaseEntity } from 'src/clients/entities/base.entity'
import { Program } from 'src/programs/entities/program.entity'
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'

@Entity()
export class Service extends BaseEntity {
    @PrimaryGeneratedColumn()
    service_id: number

    @Column({ type: 'varchar' })
    name: string

    @Column({ type: 'text', nullable: true })
    description: string

    @OneToMany(() => Program, (program) => program.service)
    programs: Program[]
}
