// src/entities/partner.entity.ts
import { Entity, Column, PrimaryGeneratedColumn,  } from 'typeorm';

@Entity()
export class Partner {
  @PrimaryGeneratedColumn()
  partner_id: number;

  @Column()
  name: string;

  @Column()
  offered_services: string;

  @Column()
  discount_rate: number;

  //   @OneToMany(() => Discount, (discount) => discount.partner)
  //   discounts: Discount[];
}
