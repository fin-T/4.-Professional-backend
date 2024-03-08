import { Films } from "src/films/entities/films.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, 
    PrimaryGeneratedColumn, Relation, Unique } from "typeorm";
import { PeopleImages } from "./peopleImages.entity";
import { Planets } from "src/planets/entities/planets.entity";
import { Species } from "src/species/entities/species.entity";
console.log('People')
@Entity()
@Unique(['url'])
export class People {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    height: string;

    @Column({ nullable: true })
    mass: string;

    @Column({ nullable: true })
    hair_color: string;

    @Column({ nullable: true })
    skin_color: string;

    @Column({ nullable: true })
    eye_color: string;

    @Column({ nullable: true })
    birth_year: string;

    @Column({ nullable: true })
    gender: string;

    @ManyToOne(() => Planets, (planet) => planet.residents, { nullable: true })
    @JoinColumn()
    homeworld: Planets;

    @ManyToMany(() => Films, (films) => films.characters, { nullable: true })
    @JoinTable()
    films: Films[];

    @ManyToMany(() => Species, (specie) => specie.people, { nullable: true })
    species: Species[];

    // @ManyToMany(() => Vehicle, (vehicle) => vehicle.pilots, { nullable: true })
    // @JoinTable()
    // vehicle: Vehicle[];

    // @ManyToMany(() => Starship, (starship) => starship.pilots, { nullable: true })
    // @JoinTable()
    // starships: Starship[];

    @Column()
    created: string;

    @Column()
    edited: string;

    @Column()
    url: string;

    @OneToMany(() => PeopleImages, (images) => images.people, { nullable: true })
    @JoinTable()
    images: Relation<PeopleImages>[];
};