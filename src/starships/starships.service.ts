import { Injectable } from '@nestjs/common';
import { Starships } from './entities/starships.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StarshipsImages } from './entities/starshipsImages.entity';
import { CreateStarshipsDto } from './dto/create_starships.dto';
import { People } from 'src/people/entities/people.entity';
import { Films } from 'src/films/entities/films.entity';
import { UpdateStarshipsDto } from './dto/update_starships.dto';
import { ServiceImpl } from 'src/common/serviceImpl';
import { CommonService } from 'src/common/common.service';
console.log('StarshipsModule');
@Injectable()
export class StarshipsService extends ServiceImpl{

    constructor(
        @InjectRepository(Starships)
        public starshipsRepository: Repository<Starships>,
        @InjectRepository(StarshipsImages)
        public imagesRepository: Repository<StarshipsImages>,
        private readonly commonService: CommonService
    ) {
        super(starshipsRepository, imagesRepository)
    }

    async create(data: CreateStarshipsDto): Promise<Starships> {
        try {
            let newStarships = new Starships();

            Object.assign(newStarships, data);

            newStarships.url = data.url || await this.createItemUniqueUrl(newStarships);

            newStarships.pilots = data.pilots && data.pilots.length > 0 ?
                await this.commonService.getEntitiesByUrls(new People, data.pilots) : null;

            newStarships.films = data.films && data.films.length > 0 ?
                await this.commonService.getEntitiesByUrls(new Films, data.films) : null;

            newStarships.created = new Date().toISOString();
            newStarships.edited = new Date().toISOString();

            await this.starshipsRepository.save(newStarships);

            console.log('The starship was crated successfully.');

            return newStarships;
        } catch (error) {
            console.error('Error creating starship:', error);
        }
    }

    async update(starshipId: number, updatedData?: UpdateStarshipsDto): Promise<Starships> {
        try {
            let starshipToUpdate = await this.starshipsRepository.findOneBy({ id: starshipId });

            Object.assign(starshipToUpdate, updatedData);

            starshipToUpdate.pilots = updatedData.pilots && updatedData.pilots.length > 0 ?
                await this.commonService.getEntitiesByUrls(new People, updatedData.pilots) : null;

            starshipToUpdate.films = updatedData.films && updatedData.films.length > 0 ?
                await this.commonService.getEntitiesByUrls(new Films, updatedData.films) : null;

            starshipToUpdate.edited = new Date().toISOString();
            await this.starshipsRepository.save(starshipToUpdate)

            console.log('The starship was updated successfully.');

            return starshipToUpdate;
        } catch (error) {
            console.error('Starship updating error:', error);
        }
    }
}