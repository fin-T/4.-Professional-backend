import { People } from "src/people/entities/people.entity";
import { 
    Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, Relation, Unique 
} from "typeorm";
import { FilmsImages } from "./filmsImages.entity";
import { Planets } from "src/planets/entities/planets.entity";
import { Species } from "src/species/entities/species.entity";
import { Vehicles } from "src/vehicles/entities/vehicles.entity";
import { Starships } from "src/starships/entities/starships.entity";
console.log('Films');

@Entity()
@Unique(['url'])
export class Films {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
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

    @ManyToMany(() => Planets, (planet) => planet.films, { nullable: true })
    @JoinTable()
    planets: Planets[];

    @ManyToMany(() => Starships, (starship) => starship.films, { nullable: true })
    @JoinTable()
    starships: Starships[];

    @ManyToMany(() => Vehicles, (vehicle) => vehicle.films, { nullable: true })
    @JoinTable()
    vehicles: Vehicles[];

    @ManyToMany(() => Species, (specie) => specie.films, { nullable: true })
    @JoinTable()
    species: Species[];

    @Column()
    created: string;

    @Column()
    edited: string;

    @Column()
    url: string;

    @OneToMany(() => FilmsImages, (images) => images.films, { nullable: true })
    @JoinTable()
    images: Relation<FilmsImages>[];
}