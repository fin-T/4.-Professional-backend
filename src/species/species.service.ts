import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Species } from './entities/species.entity';
import { Repository } from 'typeorm';
import { SpeciesImages } from './entities/speciesImages.entity';
import { CreateSpeciesDto } from './dto/create_species.dto';
import { UpdateSpeciesDto } from './dto/update_spacies.dto';
import { People } from './../people/entities/people.entity';
import { Films } from './../films/entities/films.entity';
import { ServiceImpl } from './../common/serviceImpl';
import { CommonService } from './../common/common.service';
import { Planets } from './../planets/entities/planets.entity';
console.log('SpeciesService');

@Injectable()
export class SpeciesService extends ServiceImpl {
  constructor(
    @InjectRepository(Species)
    public speciesRepository: Repository<Species>,
    @InjectRepository(SpeciesImages)
    public imagesRepository: Repository<SpeciesImages>,
    public commonService: CommonService,
  ) {
    super(speciesRepository, imagesRepository);
  }

  async create(data: CreateSpeciesDto): Promise<Species> {
    try {
      const newSpecie = new Species();

      Object.assign(newSpecie, data);

      newSpecie.url = data.url || (await this.createItemUniqueUrl(newSpecie));

      const planets = data.homeworld
        ? await this.commonService.getEntitiesByUrls(new Planets(), [
            data.homeworld,
          ])
        : [];
      newSpecie.homeworld = planets && planets.length > 0 ? planets[0] : null;

      newSpecie.people = data.people
        ? await this.commonService.getEntitiesByUrls(new People(), data.people)
        : [];

      newSpecie.films = data.films
        ? await this.commonService.getEntitiesByUrls(new Films(), data.films)
        : [];

      newSpecie.created = new Date().toISOString();
      newSpecie.edited = new Date().toISOString();

      await this.speciesRepository.save(newSpecie);

      console.log('The specie was crated successfully.');

      return newSpecie;
    } catch (error) {
      console.error('Error creating specie:', error);
    }
  }

  async update(
    specieId: number,
    updatedData?: UpdateSpeciesDto,
  ): Promise<Species> {
    try {
      const specieToUpdate = await this.speciesRepository.findOneBy({
        id: specieId,
      });

      Object.assign(specieToUpdate, updatedData);

      const planets = updatedData.homeworld
        ? await this.commonService.getEntitiesByUrls(new Planets(), [
            updatedData.homeworld,
          ])
        : [];
      specieToUpdate.homeworld =
        planets && planets.length > 0 ? planets[0] : null;

      specieToUpdate.people = updatedData.people
        ? await this.commonService.getEntitiesByUrls(
            new People(),
            updatedData.people,
          )
        : [];

      specieToUpdate.films = updatedData.films
        ? await this.commonService.getEntitiesByUrls(
            new Films(),
            updatedData.films,
          )
        : [];

      specieToUpdate.edited = new Date().toISOString();
      await this.speciesRepository.save(specieToUpdate);

      console.log('The specie was updated successfully.');

      return specieToUpdate;
    } catch (error) {
      console.error('Specie updating error:', error);
    }
  }
}
