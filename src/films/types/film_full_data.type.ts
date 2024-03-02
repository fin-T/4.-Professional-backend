import { People } from "src/people/entities/people.entity";

export type FilmFullData = {
    title: string;
    episode_id: number;
    opening_crawl: string;
    director: string;
    producer: string;
    release_date: string;
    characters: People[] | string[];
    // @ManyToMany(() => Planet (planet) => planet.films { nullable: true })
    // @JoinTable()
    // planets: Planet[];

    // @ManyToMany(() => Starship (starship) => starship.films { nullable: true })
    // @JoinTable()
    // starships: Starship[];

    // @ManyToMany(() => Vehicle (vehicle) => vehicle.films { nullable: true })
    // @JoinTable()
    // vehicle: Vehicle[];

    // @ManyToMany(() => Specie (specie) => specie.films { nullable: true })
    // @JoinTable()
    // species: Specie[];
    created: string;
    edited: string;
    url: string;
}