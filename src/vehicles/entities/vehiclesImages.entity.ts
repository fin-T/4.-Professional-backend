import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Vehicles } from './vehicles.entity';
console.log('VehiclesImages');
@Entity()
export class VehiclesImages {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @ManyToOne(() => Vehicles, (vehicles) => vehicles.images, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  vehicles: Relation<Vehicles>[];
}
