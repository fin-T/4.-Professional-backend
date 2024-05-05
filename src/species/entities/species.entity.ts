import { Films } from './../../films/entities/films.entity';
import { People } from './../../people/entities/people.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  Unique,
} from 'typeorm';
import { SpeciesImages } from './speciesImages.entity';
import { Planets } from './../../planets/entities/planets.entity';
console.log('Species');

@Entity()
@Unique(['url'])
export class Species {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  classification: string;

  @Column({ nullable: true })
  designation: string;

  @Column({ nullable: true })
  average_height: string;

  @Column({ nullable: true })
  skin_colors: string;

  @Column({ nullable: true })
  hair_colors: string;

  @Column({ nullable: true })
  eye_colors: string;

  @Column({ nullable: true })
  average_lifespan: string;

  @ManyToOne(() => Planets)
  @JoinColumn()
  homeworld: Planets;

  @Column({ nullable: true })
  language: string;

  @ManyToMany(() => People, (person) => person.species, { nullable: true })
  @JoinTable({ name: 'species_people' })
  people: People[];

  @ManyToMany(() => Films, (film) => film.species, { nullable: true })
  films: Relation<Films>[];

  @Column()
  created: string;

  @Column()
  edited: string;

  @Column()
  url: string;

  @OneToMany(() => SpeciesImages, (images) => images.species, {
    nullable: true,
  })
  @JoinTable({ name: 'species_images' })
  images: Relation<SpeciesImages>[];
}
