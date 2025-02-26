import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntities } from '../../common/entity/base.entity';
import { Rental } from '../../rental/entities/rental.entity';
import { Transaction } from '../../transaction/entities/transaction.entity';

@Entity({ name: 'users' })
export class User extends BaseEntities {
  @Column({ type: 'varchar', length: 125, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 125, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 125, unique: true })
  phone_number: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'enum', enum: ['admin', 'renter'], default: 'renter' })
  role: string;

  @Column({ name: 'refresh_token', nullable: true })
  refreshToken: string;

  @OneToMany(() => Rental, (rental) => rental.user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  rentals: Rental[];

  @OneToMany(() => Transaction, (transaction) => transaction.user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  transactions: Transaction[];
}
