import { Column, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { Films } from "./films.entity";

@Entity()
export class FilmsImages {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    url: string

    @ManyToOne(() => Films, (film) => film.images, { nullable: true})
    @JoinTable()
    films: Relation<Films>;
}