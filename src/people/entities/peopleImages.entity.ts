import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { People } from './people.entity';
console.log('PeopleImages');

@Entity()
export class PeopleImages {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @ManyToOne(() => People, (person) => person.images, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  people: Relation<People>;
}
