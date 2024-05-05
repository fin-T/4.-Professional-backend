import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Planets } from './planets.entity';
console.log('PlanetsImages');

@Entity()
export class PlanetsImages {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @ManyToOne(() => Planets, (planet) => planet.images, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  planets: Relation<Planets>;
}
