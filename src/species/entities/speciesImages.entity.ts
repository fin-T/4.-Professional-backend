import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { Species } from "./species.entity";
console.log('SpeciesImages')

@Entity()
export class SpeciesImages {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    url: string;

    @ManyToOne(() => Species, (specie) => specie.images, { nullable: true, onDelete: 'CASCADE' })
    species: Relation<Species>; 
}