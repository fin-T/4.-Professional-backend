import { Column, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { People } from "./people.entity";

@Entity()
export class PeopleImages {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    url: string

    @ManyToOne(() => People, (person) => person.images, { nullable: true})
    @JoinTable()
    people: Relation<People>;
}