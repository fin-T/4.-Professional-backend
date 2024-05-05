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
import { VehiclesImages } from './vehiclesImages.entity';
console.log('Vehicles');
@Entity()
@Unique(['url'])
export class Vehicles {
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
  vehicle_class: string;

  @ManyToMany(() => People, (pilots) => pilots.vehicles, { nullable: true })
  pilots: People[];

  @ManyToMany(() => Films, (films) => films.vehicles, { nullable: true })
  films: Films[];

  @Column()
  created: string;

  @Column()
  edited: string;

  @Column()
  url: string;

  @OneToMany(() => VehiclesImages, (images) => images.vehicles, {
    nullable: true,
  })
  @JoinTable({ name: 'vehicles_images' })
  images: Relation<VehiclesImages>[];
}
