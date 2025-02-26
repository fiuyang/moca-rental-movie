import { BaseEntities } from '../../common/entity/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Rental } from '../../rental/entities/rental.entity';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'transactions' })
export class Transaction extends BaseEntities {
  @ManyToOne(() => Rental, (rental) => rental.transactions, { eager: true })
  rental: Rental;

  @ManyToOne(() => User, (user) => user.transactions, { eager: true })
  user: User;

  @Column({ type: 'varchar', length: 125 })
  payment_method: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  order_id: string;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  gross_amount: number;

  @Column({
    type: 'enum',
    enum: ['pending', 'settlement', 'failed', 'expire', 'paid'],
    default: 'pending',
  })
  status: string;

  @Column({ type: 'enum', enum: ['rental', 'late_fee'], default: 'rental' })
  payment_type: 'rental' | 'late_fee';
}
