import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Films } from './entities/films.entity';
import { FilmsImages } from './entities/filmsImages.entity';
import { CreateFilmsDto } from './dto/create_films.dto';
import { UpdateFilmsDto } from './dto/update_films.dto';
import { OneOfItems } from './../common/types/types';
import { Planets } from './../planets/entities/planets.entity';
import { Species } from './../species/entities/species.entity';
import { People } from './../people/entities/people.entity';
import { Vehicles } from './../vehicles/entities/vehicles.entity';
import { Starships } from './../starships/entities/starships.entity';
import { ServiceImpl } from './../common/serviceImpl';
import { CommonService } from './../common/common.service';
console.log('FilmsService');

@Injectable()
export class FilmsService extends ServiceImpl {
  constructor(
    @InjectRepository(Films)
    public filmsRepository: Repository<Films>,
    @InjectRepository(FilmsImages)
    public imagesRepository: Repository<FilmsImages>,
    private readonly commonService: CommonService,
  ) {
    super(filmsRepository, imagesRepository);
  }

  async create(data: CreateFilmsDto): Promise<OneOfItems> {
    try {
      const newFilm = new Films();

      Object.assign(newFilm, data);

      newFilm.url = data.url || (await this.createItemUniqueUrl(newFilm));

      newFilm.characters = data.characters
        ? await this.commonService.getEntitiesByUrls(
            new People(),
            data.characters,
          )
        : [];

      newFilm.planets = data.planets
        ? await this.commonService.getEntitiesByUrls(
            new Planets(),
            data.planets,
          )
        : [];

      newFilm.species = data.species
        ? await this.commonService.getEntitiesByUrls(
            new Species(),
            data.species,
          )
        : [];

      newFilm.vehicles = data.vehicles
        ? await this.commonService.getEntitiesByUrls(
            new Vehicles(),
            data.vehicles,
          )
        : [];

      newFilm.starships = data.starships
        ? await this.commonService.getEntitiesByUrls(
            new Starships(),
            data.starships,
          )
        : [];

      newFilm.created = new Date().toISOString();
      newFilm.edited = new Date().toISOString();

      await this.filmsRepository.save(newFilm);

      console.log('The film was crated successfully.');

      return newFilm;
    } catch (error) {
      console.error('Error creating film:', error);
    }
  }

  async update(
    filmId: number,
    updatedData?: UpdateFilmsDto,
  ): Promise<OneOfItems> {
    try {
      const filmToUpdate = await this.filmsRepository.findOneBy({ id: filmId });

      Object.assign(filmToUpdate, updatedData);

      filmToUpdate.characters = updatedData.characters
        ? await this.commonService.getEntitiesByUrls(
            new People(),
            updatedData.characters,
          )
        : [];

      filmToUpdate.planets = updatedData.planets
        ? await this.commonService.getEntitiesByUrls(
            new Planets(),
            updatedData.planets,
          )
        : [];

      filmToUpdate.species = updatedData.species
        ? await this.commonService.getEntitiesByUrls(
            new Species(),
            updatedData.species,
          )
        : [];

      filmToUpdate.vehicles = updatedData.vehicles
        ? await this.commonService.getEntitiesByUrls(
            new Vehicles(),
            updatedData.vehicles,
          )
        : [];

      filmToUpdate.starships = updatedData.starships
        ? await this.commonService.getEntitiesByUrls(
            new Starships(),
            updatedData.starships,
          )
        : [];

      filmToUpdate.edited = new Date().toISOString();
      await this.filmsRepository.save(filmToUpdate);

      console.log('The film was updated successfully.');

      return filmToUpdate;
    } catch (error) {
      console.error('Film updating error:', error);
    }
  }
}
