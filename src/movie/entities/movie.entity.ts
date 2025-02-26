import { BaseEntities } from '../../common/entity/base.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { Genre } from '../../genre/entities/genre.entity';
import { Rental } from '../../rental/entities/rental.entity';

@Entity({ name: 'movies' })
export class Movie extends BaseEntities {
  @Column({ type: 'varchar', length: 150 })
  title: string;

  @JoinTable()
  @ManyToMany(() => Genre, (genre) => genre.movies, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  genres: Genre[];

  @Column({ name: 'stock', type: 'int', default: 0 })
  stock: number;

  @Column({
    name: 'daily_rental_rate',
    type: 'numeric',
    precision: 12,
    scale: 2,
  })
  dailyRentalRate: number;

  @OneToMany(() => Rental, (rental) => rental.movie, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  rentals: Rental[];
}
