import { Films } from './../../films/entities/films.entity';
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
import { PeopleImages } from './peopleImages.entity';
import { Planets } from './../../planets/entities/planets.entity';
import { Species } from './../../species/entities/species.entity';
import { Vehicles } from './../../vehicles/entities/vehicles.entity';
import { Starships } from './../../starships/entities/starships.entity';
console.log('People');

@Entity()
@Unique(['url'])
export class People {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  height: string;

  @Column({ nullable: true })
  mass: string;

  @Column({ nullable: true })
  hair_color: string;

  @Column({ nullable: true })
  skin_color: string;

  @Column({ nullable: true })
  eye_color: string;

  @Column({ nullable: true })
  birth_year: string;

  @Column({ nullable: true })
  gender: string;

  @ManyToOne(() => Planets, (planet) => planet.residents, { nullable: true })
  @JoinColumn()
  homeworld: Planets;

  @ManyToMany(() => Films, (films) => films.characters, { nullable: true })
  @JoinTable({ name: 'people_films' })
  films: Films[];

  @ManyToMany(() => Species, (specie) => specie.people, { nullable: true })
  species: Species[];

  @ManyToMany(() => Vehicles, (vehicle) => vehicle.pilots, { nullable: true })
  @JoinTable({ name: 'people_vehicles' })
  vehicles: Vehicles[];

  @ManyToMany(() => Starships, (starship) => starship.pilots, {
    nullable: true,
  })
  @JoinTable({ name: 'people_starships' })
  starships: Starships[];

  @Column()
  created: string;

  @Column()
  edited: string;

  @Column()
  url: string;

  @OneToMany(() => PeopleImages, (images) => images.people, { nullable: true })
  @JoinTable({ name: 'people_images' })
  images: Relation<PeopleImages>[];
}
