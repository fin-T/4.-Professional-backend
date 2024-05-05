import { People } from './../../people/entities/people.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  Unique,
} from 'typeorm';
import { PlanetsImages } from './planetsImages.entity';
import { Films } from './../../films/entities/films.entity';
console.log('Planets');

@Entity()
@Unique(['url'])
export class Planets {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  rotation_period: string;

  @Column({ nullable: true })
  orbital_period: string;

  @Column({ nullable: true })
  diameter: string;

  @Column({ nullable: true })
  climate: string;

  @Column({ nullable: true })
  gravity: string;

  @Column({ nullable: true })
  terrain: string;

  @Column({ nullable: true })
  surface_water: string;

  @Column({ nullable: true })
  population: string;

  @OneToMany(() => People, (person) => person.homeworld, { nullable: true })
  residents: People[];

  @ManyToMany(() => Films, (film) => film.planets, { nullable: true })
  films: Films[];

  @Column()
  created: string;

  @Column()
  edited: string;

  @Column()
  url: string;

  @OneToMany(() => PlanetsImages, (images) => images.planets, {
    nullable: true,
  })
  @JoinTable({ name: 'planets_images' })
  images: Relation<PlanetsImages>[];
}
