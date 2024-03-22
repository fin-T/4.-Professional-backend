import { BadRequestException, Body, Controller, Delete, Get, HttpException, Param, Post, Put, Query, UseFilters, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PlanetsService } from './planets.service';
import { CreatePlanetsDto } from './dto/create_planets.dto';
import { UpdatePlanetsDto } from './dto/update_planets.rto';
import { ImagesDto } from 'src/common/dto/images.dto';
import { OneOfItems } from 'src/common/types/types';
import { MESSAGE_ABOUT_NONEXISTENT_URLS } from 'src/common/constants/constants';
import { CommonService } from 'src/common/common.service';
import { HttpExceptionFilter } from 'src/exeptionFilters/httpExeptionFilter';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { RolesGuard } from 'src/guards/roles.guard';
import { CreateUserDto } from 'src/auth/dto/create_user.dto';
import { CREATE, DELETE, DELETE_IMAGES, DOWNLOAD_IMAGES, UPDATE } from './descriptions/planets.descriptions';
console.log('PlanetsController')

@ApiTags('Planets')
@Controller('planets')
@UseFilters(HttpExceptionFilter)
export class PlanetsController {
    constructor(
        private planetsService: PlanetsService,
        private commonService: CommonService
    ) { }

    @Post()
    @ApiOperation({ summary: 'Creating planet.', description: CREATE })
    @ApiBody({ type: CreatePlanetsDto && CreateUserDto, required: true })
    @UseGuards(LocalAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    async createPlanet(@Body() data: CreatePlanetsDto): Promise<Partial<OneOfItems>> {
        if (await this.planetsService.isItemUrlExists(data.url)) {
            throw new HttpException('A planet with the same URL already exists.', 409)
        }

        let nonExistingUrls = await this.commonService.getNonExistingItemUrls(data);
        if (nonExistingUrls && nonExistingUrls && nonExistingUrls.length > 0) {
            throw new HttpException(`${MESSAGE_ABOUT_NONEXISTENT_URLS} ${nonExistingUrls}`, 404);
        }

        let newPlanet = await this.planetsService.create(data);
        return this.planetsService.setItemDataForResponse(newPlanet);
    }

    @Get()
    @ApiOperation({ summary: 'Getting planets on the page.' })
    @ApiQuery({
        type: Number, name: 'page',
        description: 'Planets page. If no value is passed, the first 10 planets will be returned.',
        required: false, example: 1
    })
    @Roles(Role.Admin, Role.User)
    async getPlanets(@Query('page') page?: number): Promise<Partial<OneOfItems>[]> {
        let planets = [];
        if (!page) {
            planets = await this.planetsService.getItemsFromThePage(1);
        } else {
            planets = await this.planetsService.getItemsFromThePage(page);
        }

        if (planets.length === 0) throw new HttpException('Planets not found.', 404);

        let planetsForResponse = planets.map((vehicle) => {
            return this.planetsService.setItemDataForResponse(vehicle)
        })

        return planetsForResponse;
    }

    @Put(':id')
    @ApiOperation({ summary: 'Updating planet data.', description: UPDATE })
    @ApiParam({ name: 'id', description: 'Planet id', type: Number })
    @ApiBody({ type: UpdatePlanetsDto && CreateUserDto, required: false })
    @UseGuards(LocalAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    async updatePlanet(@Param('id') planetId: number,
        @Body() updatedData: UpdatePlanetsDto): Promise<Partial<OneOfItems>> {
        let planetToUpdate = await this.planetsService.getItem(Number(planetId));
        if (!planetToUpdate) throw new BadRequestException('Planet not found');

        if (updatedData.url && await this.planetsService.isItemUrlExists(updatedData.url)) {
            throw new HttpException(`Url ${updatedData.url} is busied.`, 409);
        }

        let nonExistingUrls = await this.commonService.getNonExistingItemUrls(updatedData);
        if (nonExistingUrls.length > 0) {
            throw new HttpException(`${MESSAGE_ABOUT_NONEXISTENT_URLS} ${nonExistingUrls}`, 404);
        }

        let updatedPlanet = await this.planetsService.update(planetId, updatedData);
        return this.planetsService.setItemDataForResponse(updatedPlanet);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Deleting a planet.', description: DELETE })
    @ApiParam({ type: Number, name: 'id', description: 'Planet id' })
    @ApiBody({ type: CreateUserDto, required: true })
    @UseGuards(LocalAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    async deletePlanet(@Param('id') planetId: number): Promise<Partial<OneOfItems>> {
        let planetToDelete = await this.planetsService.getItem(Number(planetId));

        if (!planetToDelete) throw new HttpException('Data not found.', 404);

        let deletedPlanet = await this.planetsService.deleteItem(Number(planetId));
        if (!deletedPlanet) throw new HttpException('Item not found.', 404);

        return this.planetsService.setItemDataForResponse(deletedPlanet);
    }

    @Post(':id/images')
    @ApiOperation({ summary: 'Downloading images.', description: DOWNLOAD_IMAGES })
    @ApiBody({ type: ImagesDto && CreateUserDto, required: true })
    @ApiParam({ type: Number, name: 'id', description: 'Planet id' })
    @UseGuards(LocalAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    async downloadImages(@Body() imagesData: ImagesDto,
        @Param('id') planetId: number): Promise<Partial<OneOfItems>> {
        let planet = await this.planetsService.getItem(Number(planetId));
        if (!planet) throw new HttpException('Planet not found.', 404);

        let planetWithImages = await this.planetsService.downloadItemImages(imagesData, planet);
        return this.planetsService.setItemDataForResponse(planetWithImages);
    }

    @Delete(':planetId/images/:imageId')
    @ApiOperation({ summary: 'Deleting an image.', description: DELETE_IMAGES })
    @ApiParam({ type: Number, name: 'planetId', description: 'Planet id' })
    @ApiParam({ type: Number, name: 'imageId', description: 'Image id' })
    @ApiBody({ type: CreateUserDto, required: true })
    @UseGuards(LocalAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    async deleteImages(@Param('planetId') planetId: number,
        @Param('imageId') imageId: number): Promise<Partial<OneOfItems>> {
        let planet = await this.planetsService.getItem(Number(planetId));
        if (!planet) throw new HttpException('Planet not found.', 404);

        let imageToDelete = await this.planetsService.getImage(Number(imageId));
        if (!imageToDelete) throw new HttpException('Image not found.', 404);

        await this.planetsService.deleteImage(imageId);
        let planetWithoutImage = await this.planetsService.getItem(Number(planetId));
        return this.planetsService.setItemDataForResponse(planetWithoutImage);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Getting a planet.' })
    @ApiParam({ type: Number, name: 'id', description: 'Planet id' })
    @Roles(Role.Admin, Role.User)
    async getPlanet(@Param('id') planetId?: number): Promise<Partial<OneOfItems>> {
        let planet = await this.planetsService.getItem(Number(planetId));
        if (!planet) throw new HttpException('Planet not found.', 404);

        return this.planetsService.setItemDataForResponse(planet);
    }
}