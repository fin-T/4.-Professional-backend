import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Films } from './films.entity';
console.log('FilmsImages');

@Entity()
export class FilmsImages {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @ManyToOne(() => Films, (film) => film.images, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  films: Relation<Films>;
}
