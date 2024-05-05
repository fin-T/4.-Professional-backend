import { Films } from './../../films/entities/films.entity';
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
import { StarshipsImages } from './starshipsImages.entity';

console.log('Starships');

@Entity()
@Unique(['url'])
export class Starships {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  model: string;

  @Column({ nullable: true })
  manufacturer: string;

  @Column({ nullable: true })
  cost_in_credits: string;

  @Column({ nullable: true })
  length: string;

  @Column({ nullable: true })
  max_atmosphering_speed: string;

  @Column({ nullable: true })
  crew: string;

  @Column({ nullable: true })
  passengers: string;

  @Column({ nullable: true })
  cargo_capacity: string;

  @Column({ nullable: true })
  consumables: string;

  @Column({ nullable: true })
  hyperdrive_rating: string;

  @Column({ nullable: true })
  MGLT: string;

  @Column({ nullable: true })
  starship_class: string;

  @ManyToMany(() => People, (pilots) => pilots.starships, { nullable: true })
  pilots: Relation<People>[];

  @ManyToMany(() => Films, (films) => films.starships, { nullable: true })
  films: Films[];

  @Column()
  created: string;

  @Column()
  edited: string;

  @Column()
  url: string;

  @OneToMany(() => StarshipsImages, (images) => images.starships, {
    nullable: true,
  })
  @JoinTable({ name: 'starships_images' })
  images: Relation<StarshipsImages>[];
}
