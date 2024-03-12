import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Species } from './entities/species.entity';
import { Repository } from 'typeorm';
import { SpeciesImages } from './entities/speciesImages.entity';
import { CreateSpeciesDto } from './dto/create_species.dto';
import { UpdateSpeciesDto } from './dto/update_spacies.dto';
import { People } from 'src/people/entities/people.entity';
import { Films } from 'src/films/entities/films.entity';
import { ServiceImpl } from 'src/common/serviceImpl';
import { CommonService } from 'src/common/common.service';
console.log('SpeciesService')

@Injectable()
export class SpeciesService extends ServiceImpl {

    constructor(
        @InjectRepository(Species)
        public speciesRepository: Repository<Species>,
        @InjectRepository(SpeciesImages)
        public imagesRepository: Repository<SpeciesImages>,
        public commonService: CommonService
    ) {
        super(speciesRepository, imagesRepository)
    }

    async create(data: CreateSpeciesDto): Promise<Species> {
        try {
            let newSpecie = new Species();

            Object.assign(newSpecie, data);

            newSpecie.url = data.url || await this.createItemUniqueUrl(newSpecie);

            newSpecie.people = data.people && data.people.length > 0 ?
                await this.commonService.getEntitiesByUrls(new People, data.people) : null;

            newSpecie.films = data.films && data.films.length > 0 ?
                await this.commonService.getEntitiesByUrls(new Films, data.films) : null;

            newSpecie.created = new Date().toISOString();
            newSpecie.edited = new Date().toISOString();

            await this.speciesRepository.save(newSpecie);

            console.log('The specie was crated successfully.');

            return newSpecie;
        } catch (error) {
            console.error('Error creating specie:', error);
        }
    }

    async update(specieId: number, updatedData?: UpdateSpeciesDto): Promise<Species> {
        try {
            let specieToUpdate = await this.speciesRepository.findOneBy({ id: specieId });

            Object.assign(specieToUpdate, updatedData);

            specieToUpdate.people = updatedData.people && updatedData.people.length > 0 ?
                await this.commonService.getEntitiesByUrls(new People, updatedData.people) : null;

            specieToUpdate.films = updatedData.films && updatedData.films.length > 0 ?
                await this.commonService.getEntitiesByUrls(new Films, updatedData.films) : null;

            specieToUpdate.edited = new Date().toISOString();
            await this.speciesRepository.save(specieToUpdate);

            console.log('The specie was updated successfully.');

            return specieToUpdate;
        } catch (error) {
            console.error('Specie updating error:', error);
        }
    }
}
