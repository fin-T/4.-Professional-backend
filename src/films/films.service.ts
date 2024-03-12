import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Films } from './entities/films.entity';
import { FilmsImages } from './entities/filmsImages.entity';
import { CreateFilmsDto } from './dto/create_films.dto';
import { UpdateFilmsDto } from './dto/update_films.dto';
import { OneOfItems } from 'src/common/types/types';
import { Planets } from 'src/planets/entities/planets.entity';
import { Species } from 'src/species/entities/species.entity';
import { People } from 'src/people/entities/people.entity';
import { Vehicles } from 'src/vehicles/entities/vehicles.entity';
import { Starships } from 'src/starships/entities/starships.entity';
import { ServiceImpl } from 'src/common/serviceImpl';
import { CommonService } from 'src/common/common.service';
console.log('FilmsService');

@Injectable()
export class FilmsService extends ServiceImpl {

    constructor(
        @InjectRepository(Films)
        public filmsRepository: Repository<Films>,
        @InjectRepository(FilmsImages)
        public imagesRepository: Repository<FilmsImages>,
        private readonly commonService: CommonService
    ) {
        super(filmsRepository, imagesRepository);
    }

    async create(data: CreateFilmsDto): Promise<OneOfItems> {
        try {
            let newFilm = new Films();

            Object.assign(newFilm, data);

            newFilm.url = data.url || await this.createItemUniqueUrl(newFilm);

            newFilm.characters = data.characters && data.characters.length > 0 ?
                await this.commonService.getEntitiesByUrls(new People, data.characters) : null;

            newFilm.planets = data.planets && data.planets.length > 0 ?
                await this.commonService.getEntitiesByUrls(new Planets, data.planets) : null;

            newFilm.species = data.species && data.species.length > 0 ?
                await this.commonService.getEntitiesByUrls(new Species, data.species) : null;

            newFilm.vehicles = data.vehicles && data.vehicles.length > 0 ?
                await this.commonService.getEntitiesByUrls(new Vehicles, data.vehicles) : null;

            newFilm.starships = data.starships && data.starships.length > 0 ?
                await this.commonService.getEntitiesByUrls(new Starships, data.starships) : null;

            newFilm.created = new Date().toISOString();
            newFilm.edited = new Date().toISOString();

            await this.filmsRepository.save(newFilm);

            console.log('The film was crated successfully.');

            return newFilm;
        } catch (error) {
            console.error('Error creating film:', error);
        }
    }

    async update(filmId: number, updatedData?: UpdateFilmsDto): Promise<OneOfItems> {
        try {
            let filmToUpdate = await this.filmsRepository.findOneBy({ id: filmId });

            Object.assign(filmToUpdate, updatedData);

            filmToUpdate.characters = updatedData.characters && updatedData.characters.length > 0 ?
                await this.commonService.getEntitiesByUrls(new People, updatedData.characters) : null;

            filmToUpdate.planets = updatedData.planets && updatedData.planets.length > 0 ?
                await this.commonService.getEntitiesByUrls(new Planets, updatedData.planets) : null;

            filmToUpdate.species = updatedData.species && updatedData.species.length > 0 ?
                await this.commonService.getEntitiesByUrls(new Species, updatedData.species) : null;

            filmToUpdate.vehicles = updatedData.vehicles && updatedData.vehicles.length > 0 ?
                await this.commonService.getEntitiesByUrls(new Vehicles, updatedData.vehicles) : null;

            filmToUpdate.starships = updatedData.starships && updatedData.starships.length > 0 ?
                await this.commonService.getEntitiesByUrls(new Starships, updatedData.starships) : null;

            filmToUpdate.edited = new Date().toISOString();
            await this.filmsRepository.save(filmToUpdate);

            console.log('The film was updated successfully.');

            return filmToUpdate;

        } catch (error) {
            console.error('Film updating error:', error);
        }
    }
}