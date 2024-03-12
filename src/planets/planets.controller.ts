import { Body, Controller, Delete, Get, HttpException, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PlanetsService } from './planets.service';
import { CreatePlanetsDto } from './dto/create_planets.dto';
import { UpdatePlanetsDto } from './dto/update_planets.rto';
import { ImagesDto } from 'src/common/dto/images.dto';
import { OneOfItems } from 'src/common/types/types';
import { MESSAGE_ABOUT_NONEXISTENT_URLS } from 'src/common/constants/constants';
import { CommonService } from 'src/common/common.service';
console.log('PlanetsController')

@ApiTags('Planets')
@Controller('planets')
export class PlanetsController {
    constructor(
        private planetsService: PlanetsService,
        private commonService: CommonService
    ) { }

    @Post()
    @ApiOperation({
        summary: 'Creating planet.',
        description: `To create a planet, you must pass the request body with the required field <b>name</b>.<br>
        Fields available for filling: <b>name</b>, <b>rotation_period</b>, <b>orbital_period</b>, <b>diameter</b>,
        <b>climate</b>, <b>gravity</b>, <b>terrain</b>, <b>surface_water</b>, <b>population</b>, <b>residents< /b>,
        <b>species</b>, <b>vehicles</b>, <b>starships</b>, <b>films</b>, <b>url</b>.
        <br>
        The input format can be viewed [here](https://swapi.py4e.com/api/planets/1/). <br>
        <b>Be careful</b> if you do not fill in the <b>url</b> field,
        then it will be generated automatically with a unique value. <br>
        All fields may not be unique, except <b>url</b>.
        If you enter a non-unique <b>url</b>, the planet will not be created and the corresponding response will be 
        returned to you.
        <br><br>
        
    Example request: \n
    {
    "name": "Zefira",
    "films": [ "https://swapi.dev/api/films/1/", "https://swapi.dev/api/films/2/" ],
    "url": "https://some-domain.dev/api/planets/98/"
    }
        `
    })
    @ApiBody({ type: CreatePlanetsDto, required: true })
    async createPlanet(@Body() data: CreatePlanetsDto): Promise<Partial<OneOfItems>> {
        if (await this.planetsService.isItemUrlExists(data.url)) {
            throw new HttpException('A planet with the same URL already exists.', 409)
        }

        let unexistingUrls = await this.commonService.getNonExistingItemUrls(data);
        if (unexistingUrls.length > 0) {
            throw new HttpException(`${MESSAGE_ABOUT_NONEXISTENT_URLS} ${unexistingUrls}`, 404);
        }
        let newPlanet = await this.planetsService.create(data);

        let planetDataForResponse = this.planetsService.setItemDataForResponse(newPlanet);
        if (!planetDataForResponse) throw new HttpException('Unknown server error.', 500);

        return planetDataForResponse;
    }

    @Get()
    @ApiOperation({
        summary: 'Getting planets on the page.'
    })
    @ApiQuery({
        type: Number,
        name: 'page',
        description: 'Planets page. If no value is passed, the first 10 planets will be returned.',
        required: false,
        example: 1
    })
    async getPlanets(@Query('page') page?: number): Promise<Partial<OneOfItems>[]> {
        let planets = [];
        if (!page) {
            planets = await this.planetsService.getItemsFromThePage(1);
        } else {
            planets = await this.planetsService.getItemsFromThePage(page);
        }

        if (planets.length === 0) throw new HttpException('Planets not found.', 404);

        if (!planets) throw new HttpException('Unknown server error.', 500);

        let planetsForResponse = planets.map((vehicle) => {
            return this.planetsService.setItemDataForResponse(vehicle)
        })

        return planetsForResponse;
    }

    @Put(':id')
    @ApiOperation({
        summary: 'Updating planet data.',
        description: `To transfer data for updating, you must send
        request body.
        Fields available for filling: <b>name</b>, <b>rotation_period</b>, <b>orbital_period</b>, <b>diameter</b>,
        <b>climate</b>, <b>gravity</b>, <b>terrain</b>, <b>surface_water</b>, <b>population</b>, <b>residents< /b>,
        <b>species</b>, <b>vehicles</b>, <b>starships</b>, <b>films</b>,
        <b>url</b>.
        <br>
        The input format can be viewed [here](https://swapi.py4e.com/api/planets/1/). <br>
        <b>Be careful</b> if you do not fill in the <b>url</b> field,
        then it will be generated automatically with a unique value. <br>
        All fields may not be unique, except <b>url</b>.
        If you enter a non-unique <b>url</b>, the planet will not be created and the corresponding response will be 
        returned to you.
        <br><br>
        
    Example request: \n
    {
    "name": "Roma",
    "films": [ "https://swapi.dev/api/films/4/", "https://swapi.dev/api/films/3/" ],
    "url": "https://update-domain.dev/api/planets/98/"
    }
        `
    })
    @ApiParam({ name: 'id', description: 'Planet id', type: Number })
    @ApiBody({ type: UpdatePlanetsDto, required: false })
    async updatePlanet(@Param('id') planetId: number,
        @Body() updatedData: UpdatePlanetsDto): Promise<Partial<OneOfItems>> {
        if (updatedData.url && await this.planetsService.isItemUrlExists(updatedData.url)) {
            throw new HttpException(`Url ${updatedData.url} is busied.`, 409);
        }

        let nonExistingUrls = await this.commonService.getNonExistingItemUrls(updatedData);
        if (nonExistingUrls.length > 0) {
            throw new HttpException(`${MESSAGE_ABOUT_NONEXISTENT_URLS} ${nonExistingUrls}`, 404);
        }

        let updatedPlanet = await this.planetsService.update(planetId, updatedData);

        let planetDataForResponse = this.planetsService.setItemDataForResponse(updatedPlanet);
        if (!planetDataForResponse) throw new HttpException('Unknown server error.', 500);

        return planetDataForResponse;
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Deleting a planet.'
    })
    @ApiParam({ type: Number, name: 'id', description: 'Planet id' })
    async deletePlanet(@Param('id') planetId: number): Promise<Partial<OneOfItems>> {
        let planetToDelete = await this.planetsService.getItem(Number(planetId));

        if (!planetToDelete) throw new HttpException('Data not found.', 404);

        let deletedPlanet = await this.planetsService.deleteItem(Number(planetId));

        let planetDataForResponse = this.planetsService.setItemDataForResponse(deletedPlanet);
        if (!planetDataForResponse) throw new HttpException('Item not found.', 404);

        return planetDataForResponse;
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
    @ApiParam({ type: Number, name: 'id', description: 'Planet id' })
    async downloadImages(@Body() imagesData: ImagesDto,
        @Param('id') planetId: number): Promise<Partial<OneOfItems>> {
            let planet = await this.planetsService.getItem(Number(planetId));
            if (!planet) throw new HttpException('Planet not found.', 404);
    
            let planetWithImages = await this.planetsService.downloadItemImages(imagesData, planet);
            let planetDataForResponse = this.planetsService.setItemDataForResponse(planetWithImages);
            if (!planetDataForResponse) throw new HttpException('Unknown server error.', 500);
    
            return planetWithImages;
    }

    @Delete(':planetId/images/:imageId')
    @ApiOperation({
        summary: 'Deleting an image.',
        description: `Removing links (urls) to images by planet and image identifiers.`
    })
    @ApiParam({ type: Number, name: 'planetId', description: 'Planet id' })
    @ApiParam({ type: Number, name: 'imageId', description: 'Image id' })
    async deleteImages(
        @Param('planetId') planetId: number,
        @Param('imageId') imageId: number
    ): Promise<Partial<OneOfItems>> {
        let planet = await this.planetsService.getItem(Number(planetId));
        if (!planet) throw new HttpException('Planet not found.', 404);

        let imageToDelete = await this.planetsService.getImage(Number(imageId));
        if (!imageToDelete) throw new HttpException('Image not found.', 404);

        await this.planetsService.deleteImage(imageId);

        let filmDataForResponse = this.planetsService.setItemDataForResponse(planet);

        return filmDataForResponse;
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Getting a planet.'
    })
    @ApiParam({ type: Number, name: 'id', description: 'Planet id' })
    async getPlanet(@Param('id') planetId?: number): Promise<Partial<OneOfItems>> {
        let planet = await this.planetsService.getItem(Number(planetId));
        if (!planet) throw new HttpException('Planet not found.', 404);

        return this.planetsService.setItemDataForResponse(planet);
    }
}
