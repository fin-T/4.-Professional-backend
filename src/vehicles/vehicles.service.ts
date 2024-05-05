import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicles } from './entities/vehicles.entity';
import { Repository } from 'typeorm';
import { VehiclesImages } from './entities/vehiclesImages.entity';
import { CreateVehiclesDto } from './dto/create_vehicles.dto';
import { People } from './../people/entities/people.entity';
import { Films } from './../films/entities/films.entity';
import { UpdateVehiclesDto } from './dto/update_vehicles.dto';
import { ServiceImpl } from './../common/serviceImpl';
import { CommonService } from './../common/common.service';
console.log('VehiclesServise');

@Injectable()
export class VehiclesService extends ServiceImpl {
  constructor(
    @InjectRepository(Vehicles)
    public vehiclesRepository: Repository<Vehicles>,
    @InjectRepository(VehiclesImages)
    public imagesRepository: Repository<VehiclesImages>,
    public commonService: CommonService,
  ) {
    super(vehiclesRepository, imagesRepository);
  }

  async create(data: CreateVehiclesDto): Promise<Vehicles> {
    try {
      const newVehicle = new Vehicles();

      Object.assign(newVehicle, data);

      newVehicle.url = data.url || (await this.createItemUniqueUrl(newVehicle));

      newVehicle.pilots = data.pilots
        ? await this.commonService.getEntitiesByUrls(new People(), data.pilots)
        : [];

      newVehicle.films = data.films
        ? await this.commonService.getEntitiesByUrls(new Films(), data.films)
        : [];

      newVehicle.created = new Date().toISOString();
      newVehicle.edited = new Date().toISOString();

      await this.vehiclesRepository.save(newVehicle);

      console.log('The vehicle was crated successfully.');

      return newVehicle;
    } catch (error) {
      console.error('Error creating vehicle:', error);
    }
  }

  async update(
    vehicleId: number,
    updatedData?: UpdateVehiclesDto,
  ): Promise<Vehicles> {
    try {
      const vehicleToUpdate = await this.vehiclesRepository.findOneBy({
        id: vehicleId,
      });

      Object.assign(vehicleToUpdate, updatedData);

      vehicleToUpdate.pilots = updatedData.pilots
        ? await this.commonService.getEntitiesByUrls(
            new People(),
            updatedData.pilots,
          )
        : [];

      vehicleToUpdate.films = updatedData.films
        ? await this.commonService.getEntitiesByUrls(
            new Films(),
            updatedData.films,
          )
        : [];

      vehicleToUpdate.edited = new Date().toISOString();
      await this.vehiclesRepository.save(vehicleToUpdate);

      console.log('The person was updated successfully.');

      return vehicleToUpdate;
    } catch (error) {
      console.error('Vehicle updating error:', error);
    }
  }
}
