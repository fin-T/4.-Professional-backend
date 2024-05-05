import { Injectable } from '@nestjs/common';
import { Planets } from './entities/planets.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlanetsImages } from './entities/planetsImages.entity';
import { CreatePlanetsDto } from './dto/create_planets.dto';
import { UpdatePlanetsDto } from './dto/update_planets.rto';
import { People } from './../people/entities/people.entity';
import { Films } from './../films/entities/films.entity';
import { ServiceImpl } from './../common/serviceImpl';
import { CommonService } from './../common/common.service';
console.log('PlanetsService');

@Injectable()
export class PlanetsService extends ServiceImpl {
  constructor(
    @InjectRepository(Planets)
    public planetsRepository: Repository<Planets>,
    @InjectRepository(PlanetsImages)
    public imagesRepository: Repository<PlanetsImages>,
    public commonService: CommonService,
  ) {
    super(planetsRepository, imagesRepository);
  }

  async create(data: CreatePlanetsDto): Promise<Planets> {
    try {
      const newPlanet = new Planets();

      Object.assign(newPlanet, data);

      newPlanet.url = data.url || (await this.createItemUniqueUrl(newPlanet));

      newPlanet.residents = data.residents
        ? await this.commonService.getEntitiesByUrls(
            new People(),
            data.residents,
          )
        : [];

      newPlanet.films = data.films
        ? await this.commonService.getEntitiesByUrls(new Films(), data.films)
        : [];

      newPlanet.created = new Date().toISOString();
      newPlanet.edited = new Date().toISOString();

      await this.planetsRepository.save(newPlanet);

      console.log('The planet was created succesfully.');

      return newPlanet;
    } catch (error) {
      console.error('Error creating planet:', error);
    }
  }

  async update(
    planetId: number,
    updatedData?: UpdatePlanetsDto,
  ): Promise<Planets> {
    try {
      const planetToUpdate = await this.planetsRepository.findOneBy({
        id: planetId,
      });

      Object.assign(planetToUpdate, updatedData);

      planetToUpdate.residents = updatedData.residents
        ? await this.commonService.getEntitiesByUrls(
            new People(),
            updatedData.residents,
          )
        : [];

      planetToUpdate.films = updatedData.films
        ? await this.commonService.getEntitiesByUrls(
            new Films(),
            updatedData.films,
          )
        : [];

      planetToUpdate.edited = new Date().toISOString();
      await this.planetsRepository.save(planetToUpdate);

      console.log('The planet was updated successfully.');

      return planetToUpdate;
    } catch (error) {
      console.error('Planet updating error:', error);
    }
  }
}
