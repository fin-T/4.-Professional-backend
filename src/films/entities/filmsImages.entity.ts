import { Column, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { Films } from "./films.entity";
console.log('FilmsImages');

@Entity()
export class FilmsImages {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: false })
    url: string

    @ManyToOne(() => Films, (film) => film.images, { nullable: false, onDelete: 'CASCADE' })
    @JoinTable()
    films: Relation<Films>;
}