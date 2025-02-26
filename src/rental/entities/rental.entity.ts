import { BaseEntities } from '../../common/entity/base.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Movie } from '../../movie/entities/movie.entity';
import { User } from '../../user/entities/user.entity';
import { Transaction } from '../../transaction/entities/transaction.entity';

@Entity({ name: 'rentals' })
export class Rental extends BaseEntities {
  @ManyToOne(() => User, (user) => user.rentals)
  user: User;

  @ManyToOne(() => Movie, (movie) => movie.rentals)
  movie: Movie;

  @Column({ type: 'timestamp' })
  rental_date: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  return_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  returned_at: Date;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  total_price: number;

  @Column({
    type: 'enum',
    enum: ['pending', 'paid', 'cancelled'],
    default: 'pending',
  })
  payment_status: string;

  @Column({
    type: 'enum',
    enum: ['ongoing', 'returned', 'overdue'],
    default: 'ongoing',
  })
  rental_status: string;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  late_fee: number;

  @OneToMany(() => Transaction, (transaction) => transaction.rental, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  transactions: Transaction[];
}
