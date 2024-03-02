import { People } from "src/people/entities/people.entity";
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, Relation, Unique } from "typeorm";
import { FilmsImages } from "./filmsImages.entity";

@Entity()
@Unique(['url'])
export class Films {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    title: string;

    @Column({ nullable: true })
    episode_id: number;

    @Column({ length: 1000, nullable: true })
    opening_crawl: string;

    @Column({ nullable: true })
    director: string;

    @Column({ nullable: true })
    producer: string;

    @Column({ nullable: true })
    release_date: string;

    @ManyToMany(() => People, (people) => people.films, { nullable: true })
    characters: People[];

    // @ManyToMany(() => Planet, (planet) => planet.films, { nullable: true })
    // @JoinTable()
    // planets: Planet[];

    // @ManyToMany(() => Starship, (starship) => starship.films, { nullable: true })
    // @JoinTable()
    // starships: Starship[];

    // @ManyToMany(() => Vehicle, (vehicle) => vehicle.films, { nullable: true })
    // @JoinTable()
    // vehicle: Vehicle[];

    // @ManyToMany(() => Specie, (specie) => specie.films, { nullable: true })
    // @JoinTable()
    // species: Specie[];

    @Column({ nullable: true })
    created: string;

    @Column({ nullable: true })
    edited: string;

    @Column({ nullable: true })
    url: string;

    @OneToMany(() => FilmsImages, (images) => images.films, { nullable: true, cascade: true })
    images: Relation<FilmsImages>[];
}