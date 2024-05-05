import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Species } from './species.entity';
console.log('SpeciesImages');

@Entity()
export class SpeciesImages {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @ManyToOne(() => Species, (specie) => specie.images, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  species: Relation<Species>;
}
