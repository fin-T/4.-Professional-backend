import { BadRequestException, Body, Controller, Delete, Get, HttpException, Param, Post, Put, Query, UseFilters, UseGuards } from '@nestjs/common';
import { SpeciesService } from './species.service';
import { ApiOperation, ApiBody, ApiQuery, ApiParam, ApiTags } from '@nestjs/swagger';
import { OneOfItems } from 'src/common/types/types';
import { CreateSpeciesDto } from './dto/create_species.dto';
import { UpdateSpeciesDto } from './dto/update_spacies.dto';
import { ImagesDto } from 'src/common/dto/images.dto';
import { MESSAGE_ABOUT_NONEXISTENT_URLS } from 'src/common/constants/constants';
import { CommonService } from 'src/common/common.service';
import { HttpExceptionFilter } from 'src/exeptionFilters/httpExeptionFilter';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { RolesGuard } from 'src/guards/roles.guard';
import { CreateUserDto } from 'src/auth/dto/create_user.dto';
import { CREATE, DELETE, DELETE_IMAGES, DOWNLOAD_IMAGES, UPDATE } from './descriptions/species.descriptions';
console.log('SpeciesController')

@ApiTags('Species')
@Controller('species')
@UseFilters(HttpExceptionFilter)
export class SpeciesController {
    constructor(
        private speciesService: SpeciesService,
        private commonService: CommonService
    ) { }

    @Post()
    @ApiOperation({ summary: 'Creating specie.', description: CREATE })
    @ApiBody({ type: CreateSpeciesDto && CreateUserDto, required: true })
    @UseGuards(LocalAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    async createSpecie(@Body() data: CreateSpeciesDto): Promise<Partial<OneOfItems>> {
        if (await this.speciesService.isItemUrlExists(data.url)) {
            throw new HttpException('A specie with the same URL already exists.', 409)
        }

        let nonExistingUrls = await this.commonService.getNonExistingItemUrls(data);
        if (nonExistingUrls && nonExistingUrls.length > 0) {
            throw new HttpException(`${MESSAGE_ABOUT_NONEXISTENT_URLS} ${nonExistingUrls}`, 404);
        }

        let newSpecie = await this.speciesService.create(data);
        return this.speciesService.setItemDataForResponse(newSpecie);
    }

    @Get()
    @ApiOperation({ summary: 'Getting species on the page.' })
    @ApiQuery({
        type: Number, name: 'page',
        description: 'Species page. If no value is passed, the first 10 species will be returned.',
        required: false, example: 1
    })
    @Roles(Role.Admin, Role.User)
    async getSpecies(@Query('page') page?: number): Promise<Partial<OneOfItems>[]> {
        let species = [];
        if (!page) {
            species = await this.speciesService.getItemsFromThePage(1);
        } else {
            species = await this.speciesService.getItemsFromThePage(page);
        }

        if (species.length === 0) throw new HttpException('Species not found.', 404);

        let speciesForResponse = species.map((specie) => {
            return this.speciesService.setItemDataForResponse(specie)
        })

        return speciesForResponse;
    }

    @Put(':id')
    @ApiOperation({ summary: 'Updating specie data.', description: UPDATE })
    @ApiParam({ name: 'id', description: 'Specie id', type: Number })
    @ApiBody({ type: UpdateSpeciesDto && CreateUserDto, required: true })
    @UseGuards(LocalAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    async updateSpecie(@Param('id') specieId: number,
        @Body() updatedData: UpdateSpeciesDto): Promise<Partial<OneOfItems>> {
        let specieToUpdate = await this.speciesService.getItem(Number(specieId));
        if (!specieToUpdate) throw new BadRequestException('Specie not found');

        if (updatedData.url && await this.speciesService.isItemUrlExists(updatedData.url)) {
            throw new HttpException(`Url ${updatedData.url} is busied.`, 409);
        }

        let nonExistingUrls = await this.commonService.getNonExistingItemUrls(updatedData);
        if (nonExistingUrls && nonExistingUrls.length > 0) {
            throw new HttpException(`${MESSAGE_ABOUT_NONEXISTENT_URLS} ${nonExistingUrls}`, 404);
        }

        let updatedSpecie = await this.speciesService.update(specieId, updatedData);
        return this.speciesService.setItemDataForResponse(updatedSpecie);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Deleting a specie.', description: DELETE })
    @ApiParam({ type: Number, name: 'id', description: 'Specie id' })
    @ApiBody({ type: CreateUserDto, required: true })
    @UseGuards(LocalAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    async deleteSpecie(@Param('id') specieId: number): Promise<Partial<OneOfItems>> {
        let specieToDelete = await this.speciesService.getItem(Number(specieId));
        if (!specieToDelete) throw new HttpException('Data not found.', 404);

        let deletedSpecie = await this.speciesService.deleteItem(Number(specieId));
        if (!deletedSpecie) throw new HttpException('Item not found.', 404);

        return this.speciesService.setItemDataForResponse(deletedSpecie);
    }

    @Post(':id/images')
    @ApiOperation({ summary: 'Downloading images.', description: DOWNLOAD_IMAGES })
    @ApiBody({ type: ImagesDto && CreateUserDto, required: true })
    @ApiParam({ type: Number, name: 'id', description: 'Specie id' })
    @UseGuards(LocalAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    async downloadImages(@Body() imagesData: ImagesDto,
        @Param('id') specieId: number): Promise<Partial<OneOfItems>> {
        let specie = await this.speciesService.getItem(Number(specieId));
        if (!specie) throw new HttpException('Specie not found.', 404);

        let specieplanetWithImages = await this.speciesService.downloadItemImages(imagesData, specie);
        return this.speciesService.setItemDataForResponse(specieplanetWithImages);
    }

    @Delete(':specieId/images/:imageId')
    @ApiOperation({ summary: 'Deleting an image.', description: DELETE_IMAGES })
    @ApiParam({ type: Number, name: 'specieId', description: 'Specie id' })
    @ApiParam({ type: Number, name: 'imageId', description: 'Image id' })
    @ApiBody({ type: CreateUserDto, required: true })
    @UseGuards(LocalAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    async deleteImages(@Param('specieId') specieId: number,
        @Param('imageId') imageId: number): Promise<Partial<OneOfItems>> {
        let specie = await this.speciesService.getItem(Number(specieId));
        if (!specie) throw new HttpException('Specie not found.', 404);

        let imageToDelete = await this.speciesService.getImage(Number(imageId));
        if (!imageToDelete) throw new HttpException('Image not found.', 404);

        await this.speciesService.deleteImage(imageId);
        let specieWithoutImage = await this.speciesService.getItem(Number(specieId));
        return this.speciesService.setItemDataForResponse(specieWithoutImage);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Getting a specie.' })
    @ApiParam({ type: Number, name: 'id', description: 'Specie id' })
    @Roles(Role.Admin, Role.User)
    async getSpecie(@Param('id') specieId: number): Promise<Partial<OneOfItems>> {
        let specie = await this.speciesService.getItem(Number(specieId));
        if (!specie) throw new HttpException('Specie not found.', 404);

        return this.speciesService.setItemDataForResponse(specie);
    }
}