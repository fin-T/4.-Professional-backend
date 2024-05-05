import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Starships } from './starships.entity';
console.log('StarshipsImages');
@Entity()
export class StarshipsImages {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @ManyToOne(() => Starships, (starships) => starships.images, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  starships: Relation<Starships>;
}
