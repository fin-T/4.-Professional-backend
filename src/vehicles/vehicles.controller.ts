import { Body, Controller, Delete, Get, HttpException, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { VehiclesService } from './vehicles.service';
import { CreateVehiclesDto } from './dto/create_vehicles.dto';
import { OneOfItems } from 'src/common/types/types';
import { UpdateVehiclesDto } from './dto/update_vehicles.dto';
import { ImagesDto } from 'src/common/dto/images.dto';
import { MESSAGE_ABOUT_NONEXISTENT_URLS } from 'src/common/constants/constants';
import { CommonService } from 'src/common/common.service';
console.log('VehiclesController')

@ApiTags('Vehicles')
@Controller('vehicles')
export class VehiclesController {
    constructor(
        private vehiclesService: VehiclesService,
        private commonService: CommonService
    ) { }

    @Post()
    @ApiOperation({
        summary: 'Creating vehicle.',
        description: `To create a vehicle, you must pass the request body with the required field <b>name</b>.<br>
        Fields available for filling: <b>name</b>, <b>model</b>, <b>manufacturer</b>, <b>cost_in_credits</b>,
        <b>length</b>, <b>max_atmosphering_speed</b>, <b>crew</b>, <b>passengers</b>, <b>cargo_capacity</b>,
        <b>consumables</b>, <b>vehicle_class</b>, <b>pilots</b>, <b>films</b>, <b>url</b>.
        <br>
        The input format can be viewed [here](https://swapi.py4e.com/api/vehicles/4/). <br>
        <b>Be careful</b> if you do not fill in the <b>url</b> field,
        then it will be generated automatically with a unique value. <br>
        All fields may not be unique, except <b>url</b>.
        If you enter a non-unique <b>url</b>, the vehicle will not be created and the corresponding response will be
        returned to you.
        <br><br>
        
    Example request: \n
    {
    "name": "Transporter",
    "films": [ "https://swapi.py4e.com/api/films/1/", "https://swapi.py4e.com/api/films/2/" ],
    "url": "https://default-domain.dev/api/vehicles/98/"
    }
        `
    })
    @ApiBody({ type: CreateVehiclesDto, required: true })
    async createVehicle(@Body() data: CreateVehiclesDto): Promise<Partial<OneOfItems>> {
        if (await this.vehiclesService.isItemUrlExists(data.url)) {
            throw new HttpException('A vehicle with the same URL already exists.', 409)
        }

        let unexistingUrls = await this.commonService.getNonExistingItemUrls(data);
        if (unexistingUrls.length > 0) {
            throw new HttpException(`${MESSAGE_ABOUT_NONEXISTENT_URLS} ${unexistingUrls}`, 404);
        }
        let newVehicle = await this.vehiclesService.create(data);

        let vehicleDataForResponse = this.vehiclesService.setItemDataForResponse(newVehicle);
        if (!vehicleDataForResponse) throw new HttpException('Unknown server error.', 500);

        return vehicleDataForResponse;
    }

    @Get()
    @ApiOperation({
        summary: 'Getting vehicles on the page.'
    })
    @ApiQuery({
        type: Number,
        name: 'page',
        description: 'Page with vehicles. If no value is passed, the first 10 vehicles will be received.',
        required: false,
        example: 1

    })
    async getVehicles(@Query('page') page?: number): Promise<Partial<OneOfItems>[]> {
        let vehicle = [];
        if (!page) {
            vehicle = await this.vehiclesService.getItemsFromThePage(1);
        } else {
            vehicle = await this.vehiclesService.getItemsFromThePage(page);
        }

        if (vehicle.length === 0) throw new HttpException('Vehicles not found.', 404);

        if (!vehicle) throw new HttpException('Unknown server error.', 500);

        let vehiclesForResponse = vehicle.map((vehicle) => {
            return this.vehiclesService.setItemDataForResponse(vehicle)
        })

        return vehiclesForResponse;
    }

    @Put(':id')
    @ApiOperation({
        summary: 'Updating vehicle data.',
        description: `To transfer data for updating, you must send the request body.
        Fields available for filling: <b>name</b>, <b>model</b>, <b>manufacturer</b>, <b>cost_in_credits</b>,
        <b>length</b>, <b>max_atmosphering_speed</b>, <b>crew</b>, <b>passengers</b>, <b>cargo_capacity</b>,
        <b>consumables</b>, <b>vehicle_class</b>, <b>pilots</b>, <b>films</b>, <b>url</b>.
        <br>
        The input format can be viewed [here](https://swapi.py4e.com/api/vehicles/4/). <br>
        <b>Be careful</b> if you do not fill in the <b>url</b> field,
        then it will be generated automatically with a unique value. <br>
        All fields may not be unique, except <b>url</b>.
        If you enter a non-unique <b>url</b>, the vehicle will not be created and the corresponding response will be 
        returned to you.
        <br><br>
        
    Example request: \n
    {
    "name": "Transporter",
    "films": [ "https://swapi.py4e.com/api/films/1/", "https://swapi.py4e.com/api/films/2/" ]
    }
        `
    })
    @ApiParam({ name: 'id', description: 'Vehicle id', type: Number })
    @ApiBody({ type: UpdateVehiclesDto, required: false })
    async updateVehicle(
        @Param('id') vehicleId: number, @Body() updatedData: UpdateVehiclesDto
    ): Promise<Partial<OneOfItems>> {
        if (updatedData.url && await this.vehiclesService.isItemUrlExists(updatedData.url)) {
            throw new HttpException(`Url ${updatedData.url} is busied.`, 409);
        }

        let nonExistingUrls = await this.commonService.getNonExistingItemUrls(updatedData);
        if (nonExistingUrls.length > 0) {
            throw new HttpException(`${MESSAGE_ABOUT_NONEXISTENT_URLS} ${nonExistingUrls}`, 404);
        }

        let updatedVehicle = await this.vehiclesService.update(vehicleId, updatedData);

        let vehicleDataForResponse = this.vehiclesService.setItemDataForResponse(updatedVehicle);
        if (!vehicleDataForResponse) throw new HttpException('Unknown server error.', 500);

        return vehicleDataForResponse;
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Deleting a vehicle.'
    })
    @ApiParam({ type: Number, name: 'id', description: 'Vehicle id' })
    async deleteVehicle(@Param('id') vehicleId: number): Promise<Partial<OneOfItems>> {
        let vehicleToDelete = await this.vehiclesService.getItem(Number(vehicleId));

        if (!vehicleToDelete) throw new HttpException('Data not found.', 404);

        let deletedVehicle = await this.vehiclesService.deleteItem(Number(vehicleId));

        let vehicleDataForResponse = this.vehiclesService.setItemDataForResponse(deletedVehicle);
        if (!vehicleDataForResponse) throw new HttpException('Item not found.', 404);

        return vehicleDataForResponse;
    }

    @Post(':id/images')
    @ApiOperation({
        summary: 'Downloading images.',
        description: `Loading links (urls) to images. <br>
        Supported formats: <i>"jpeg"</i>, <i>"jpg"</i>, <i>"png"</i>, <i>"gif"</i>. <br>
        To download links to images, you need to send the request body with the <b>ursl</b> field.
        <br><br>
        
    Example request: \n
    {
    "urls": [ "https://domainname.12223.jpeg", "https://dsds.asdsad.12321.png"]
    }
        `
    })
    @ApiBody({ type: ImagesDto, required: false })
    @ApiParam({ type: Number, name: 'id', description: 'Vehicle id' })
    async downloadImages(@Body() imagesData: ImagesDto,
        @Param('id') vehicleId: number): Promise<Partial<OneOfItems>> {
        let vehicle = await this.vehiclesService.getItem(Number(vehicleId));
        if (!vehicle) throw new HttpException('Vehicle not found.', 404);

        let vehicleWithImages = await this.vehiclesService.downloadItemImages(imagesData, vehicle);
        let vehicleDataForResponse = this.vehiclesService.setItemDataForResponse(vehicleWithImages);
        if (!vehicleDataForResponse) throw new HttpException('Unknown server error.', 500);

        return vehicleWithImages;
    }

    @Delete(':vehicleId/images/:imageId')
    @ApiOperation({
        summary: 'Deleting an image.',
        description: `Removing links (urls) to images by vehicle and image identifiers.`
    })
    @ApiParam({ type: Number, name: 'vehicleId', description: 'Vehicle id' })
    @ApiParam({ type: Number, name: 'imageId', description: 'Image id' })
    async deleteImages(
        @Param('vehicleId') vehicleId: number,
        @Param('imageId') imageId: number
    ): Promise<Partial<OneOfItems>> {
        let vehicle = await this.vehiclesService.getItem(Number(vehicleId));
        if (!vehicle) throw new HttpException('Vehicle not found.', 404);

        let imageToDelete = await this.vehiclesService.getImage(Number(imageId));
        if (!imageToDelete) throw new HttpException('Image not found.', 404);

        await this.vehiclesService.deleteImage(imageId);

        let vehicleDataForResponse = this.vehiclesService.setItemDataForResponse(vehicle);

        return vehicleDataForResponse;
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Getting a vehicle.'
    })
    @ApiParam({ type: Number, name: 'id', description: 'Vehicle id' })
    async getPerson(@Param('id') vehicleId: number): Promise<Partial<OneOfItems>> {
        let vehicle = await this.vehiclesService.getItem(Number(vehicleId));
        if (!vehicle) throw new HttpException('Vehicle not found.', 404);

        return this.vehiclesService.setItemDataForResponse(vehicle);
    }
}