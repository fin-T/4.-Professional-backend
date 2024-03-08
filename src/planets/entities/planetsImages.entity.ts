import { Column, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { Planets } from "./planets.entity";
console.log('PlanetsImages')

@Entity()
export class PlanetsImages {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: false })
    url: string

    @ManyToOne(() => Planets, (planet) => planet.images, { nullable: true, onDelete: 'CASCADE' })
    @JoinTable()
    planets: Relation<Planets>;
}