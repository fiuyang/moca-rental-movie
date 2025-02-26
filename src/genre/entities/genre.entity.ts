import { BaseEntities } from '../../common/entity/base.entity';
import { Column, Entity, ManyToMany } from 'typeorm';
import { Movie } from '../../movie/entities/movie.entity';

@Entity({ name: 'genres' })
export class Genre extends BaseEntities {
  @Column({ type: 'varchar', length: 150, nullable: true })
  name: string;

  @ManyToMany(() => Movie, (movie) => movie.genres)
  movies: Movie[];
}
