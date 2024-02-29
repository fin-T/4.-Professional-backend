import { Films } from "src/films/entities/films.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn, Relation, Unique } from "typeorm";
import { PeopleImages } from "./peopleImages.entity";

@Entity()
@Unique(['name'])
export class People {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
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

    // @ManyToOne(() => Planet, (planet) => planet.residents, {nullable: true})
    // @JoinColumn()
    // homeworld: Planet;

    @ManyToMany(() => Films, (films) => films.characters, { nullable: true })
    @JoinTable()
    films: Films[];

    // @ManyToMany(() => Specie, (specie) => specie.people, { nullable: true })
    // @JoinTable()
    // species: Specie[];

    // @ManyToMany(() => Vehicle, (vehicle) => vehicle.pilots, { nullable: true })
    // @JoinTable()
    // vehicle: Vehicle[];

    // @ManyToMany(() => Starship, (starship) => starship.pilots, { nullable: true })
    // @JoinTable()
    // starships: Starship[];

    @Column({ nullable: true })
    created: string;

    @Column({ nullable: true })
    edited: string;
    
    @OneToOne(() => People, (people) => people.url, { nullable: true })
    @JoinColumn()
    url: Partial<People>;

    @OneToMany(() => PeopleImages, (images) => images.people, { nullable: true, cascade: true })
    images: Relation<PeopleImages>[];
};