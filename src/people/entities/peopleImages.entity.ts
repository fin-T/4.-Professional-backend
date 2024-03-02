import { Column, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn, Relation, Unique } from "typeorm";
import { People } from "./people.entity";

@Entity()
@Unique(['url'])
export class PeopleImages {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: false })
    url: string

    @ManyToOne(() => People, (person) => person.images, { nullable: true })
    @JoinTable()
    people: Relation<People>;
}