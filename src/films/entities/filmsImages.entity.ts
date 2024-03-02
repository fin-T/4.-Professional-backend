import { Column, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn, Relation, Unique } from "typeorm";
import { Films } from "./films.entity";

@Entity()
@Unique(['url'])
export class FilmsImages {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: false })
    url: string

    @ManyToOne(() => Films, (film) => film.images, { nullable: true })
    @JoinTable()
    films: Relation<Films>;
}