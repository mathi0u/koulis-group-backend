// src/entities/reservation.entity.ts
import { Client } from 'src/clients/entities/client.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  reservation_id: number;

  @ManyToOne(() => Client, (client) => client.reservations)
  client: Client;

  //   @ManyToOne(() => Program, (program) => program.reservations)
  //   program: Program;

  @Column()
  date_time: Date;

  @Column()
  status: string; // 'confirmed' or 'canceled'
}
