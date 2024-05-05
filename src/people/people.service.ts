import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { People } from './entities/people.entity';
import { PeopleImages } from './entities/peopleImages.entity';
import { CreatePeopleDto } from './dto/create_people.dto';
import { UpdatePeopleDto } from './dto/update_people.dto';
import { Planets } from './../planets/entities/planets.entity';
import { Films } from './../films/entities/films.entity';
import { Species } from './../species/entities/species.entity';
import { Vehicles } from './../vehicles/entities/vehicles.entity';
import { Starships } from './../starships/entities/starships.entity';
import { ServiceImpl } from './../common/serviceImpl';
import { CommonService } from './../common/common.service';
console.log('PeopleService');

@Injectable()
export class PeopleService extends ServiceImpl {
  constructor(
    @InjectRepository(People)
    public peopleRepository: Repository<People>,
    @InjectRepository(PeopleImages)
    public imagesRepository: Repository<PeopleImages>,
    public commonService: CommonService,
  ) {
    super(peopleRepository, imagesRepository);
  }

  async create(data: CreatePeopleDto): Promise<People> {
    try {
      const newPerson = new People();

      Object.assign(newPerson, data);
      newPerson.url = data.url || (await this.createItemUniqueUrl(newPerson));

      const planets = data.homeworld
        ? await this.commonService.getEntitiesByUrls(new Planets(), [
            data.homeworld,
          ])
        : [];
      newPerson.homeworld = planets && planets.length > 0 ? planets[0] : null;

      newPerson.films = data.films
        ? await this.commonService.getEntitiesByUrls(new Films(), data.films)
        : [];

      newPerson.species = data.species
        ? await this.commonService.getEntitiesByUrls(
            new Species(),
            data.species,
          )
        : [];

      newPerson.vehicles = data.vehicles
        ? await this.commonService.getEntitiesByUrls(
            new Vehicles(),
            data.vehicles,
          )
        : [];

      newPerson.starships = data.starships
        ? await this.commonService.getEntitiesByUrls(
            new Starships(),
            data.starships,
          )
        : [];

      newPerson.created = new Date().toISOString();
      newPerson.edited = new Date().toISOString();

      await this.peopleRepository.save(newPerson);

      console.log('The person was crated successfully.');

      return newPerson;
    } catch (error) {
      console.error('Error creating person:', error);
    }
  }

  async update(
    personId: number,
    updatedData?: UpdatePeopleDto,
  ): Promise<People> {
    try {
      const personToUpdate = await this.peopleRepository.findOneBy({
        id: personId,
      });

      Object.assign(personToUpdate, updatedData);

      const planets = updatedData.homeworld
        ? await this.commonService.getEntitiesByUrls(new Planets(), [
            updatedData.homeworld,
          ])
        : [];
      personToUpdate.homeworld =
        planets && planets.length > 0 ? planets[0] : [];

      personToUpdate.films = updatedData.films
        ? await this.commonService.getEntitiesByUrls(
            new Films(),
            updatedData.films,
          )
        : [];

      personToUpdate.species = updatedData.species
        ? await this.commonService.getEntitiesByUrls(
            new Species(),
            updatedData.species,
          )
        : [];

      personToUpdate.vehicles = updatedData.vehicles
        ? await this.commonService.getEntitiesByUrls(
            new Vehicles(),
            updatedData.vehicles,
          )
        : [];

      personToUpdate.starships = updatedData.starships
        ? await this.commonService.getEntitiesByUrls(
            new Starships(),
            updatedData.starships,
          )
        : [];

      personToUpdate.edited = new Date().toISOString();
      await this.peopleRepository.save(personToUpdate);

      console.log('The person was updated successfully.');

      return personToUpdate;
    } catch (error) {
      console.error('Person updating error:', error);
    }
  }

  addTenAndMultiplyByHundred(num: number): number {
    return (num + 10) * 100;
  }
}
