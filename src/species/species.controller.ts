import { Body, Controller, Delete, Get, HttpException, Param, Post, Put, Query } from '@nestjs/common';
import { SpeciesService } from './species.service';
import { ApiOperation, ApiBody, ApiQuery, ApiParam, ApiTags } from '@nestjs/swagger';
import { OneOfItems } from 'src/common/types/types';
import { CreateSpeciesDto } from './dto/create_species.dto';
import { UpdateSpeciesDto } from './dto/update_spacies.dto';
import { ImagesDto } from 'src/common/dto/images.dto';
import { MESSAGE_ABOUT_NONEXISTENT_URLS } from 'src/common/constants/constants';
import { CommonService } from 'src/common/common.service';
console.log('SpeciesController')

@ApiTags('Species')
@Controller('species')
export class SpeciesController {
    constructor(
        private speciesService: SpeciesService,
        private commonService: CommonService
    ) { }

    @Post()
    @ApiOperation({
        summary: 'Creating specie.',
        description: `To create a specie, you must pass the request body with the required <b>name</b> field.<br>
        Fields available for filling: <b>name</b>, <b>classification</b>, <b>designation</b>, <b>average_height</b>,
        <b>skin_colors</b>, <b>hair_colors</b>, <b>eye_colors</b>, <b>average_lifespan</b>, <b>homeworld</b>,
        <b>language</b>, <b>people</b>, <b>language</b>, <b>films</b>, <b>url</b>.
        <br>
        The input format can be viewed [here](https://swapi.py4e.com/api/species/1/). <br>
        <b>Be careful</b> if you do not fill in the <b>url</b> field,
        then it will be generated automatically with a unique value. <br>
        All fields may not be unique, except <b>url</b>.
        If you enter a non-unique <b>url</b>, the specie will not be created and the corresponding response will be 
        returned to you.
        <br><br>
        
    Example request: \n
    {
    "name": "Zefiradant",
    "films": [ "https://swapi.dev/api/films/1/", "https://swapi.dev/api/films/2/" ],
    "url": "https://some-domain.dev/api/species/98/"
    }
        `
    })
    @ApiBody({ type: CreateSpeciesDto, required: true })
    async createSpecie(@Body() data: CreateSpeciesDto): Promise<Partial<OneOfItems>> {
        if (await this.speciesService.isItemUrlExists(data.url)) {
            throw new HttpException('A specie with the same URL already exists.', 409)
        }

        let unexistingUrls = await this.commonService.getNonExistingItemUrls(data);
        if (unexistingUrls.length > 0) {
            throw new HttpException(`${MESSAGE_ABOUT_NONEXISTENT_URLS} ${unexistingUrls}`, 404);
        }
        let newSpecie = await this.speciesService.create(data);

        let specieDataForResponse = this.speciesService.setItemDataForResponse(newSpecie);
        if (!specieDataForResponse) throw new HttpException('Unknown server error.', 500);

        return specieDataForResponse;
    }

    @Get()
    @ApiOperation({
        summary: 'Getting species on the page.'
    })
    @ApiQuery({
        type: Number,
        name: 'page',
        description: 'Species page. If no value is passed, the first 10 species will be returned.',
        required: false,
        example: 1
    })
    async getSpecies(@Query('page') page?: number): Promise<Partial<OneOfItems>[]> {
        let species = [];
        if (!page) {
            species = await this.speciesService.getItemsFromThePage(1);
        } else {
            species = await this.speciesService.getItemsFromThePage(page);
        }

        if (species.length === 0) throw new HttpException('Species not found.', 404);

        if (!species) throw new HttpException('Unknown server error.', 500);

        let speciesForResponse = species.map((specie) => {
            return this.speciesService.setItemDataForResponse(specie)
        })

        return speciesForResponse;
    }

    @Put(':id')
    @ApiOperation({
        summary: 'Updating specie data.',
        description: `To transfer data for updating, you must send
        request body.
        Fields available for filling: <b>name</b>, <b>classification</b>, <b>designation</b>, <b>average_height</b>,
        <b>skin_colors</b>, <b>hair_colors</b>, <b>eye_colors</b>, <b>average_lifespan</b>, <b>homeworld</b>,
        <b>language</b>, <b>people</b>, <b>language</b>, <b>films</b>, <b>url</b>.
        <br>
        The input format can be viewed [here](https://swapi.py4e.com/api/species/1/). <br>
        <b>Be careful</b> if you do not fill in the <b>url</b> field,
        then it will be generated automatically with a unique value. <br>
        All fields may not be unique, except <b>url</b>.
        If you enter a non-unique <b>url</b>, the specie will not be created and the corresponding response will be 
        returned to you.
        <br><br>
        
    Example request: \n
    {
    "name": "Zefiradant",
    "films": [ "https://swapi.dev/api/films/1/", "https://swapi.dev/api/films/2/" ],
    "url": "https://some-domain.dev/api/species/98/"
    }
        `
    })
    @ApiParam({ name: 'id', description: 'Specie id', type: Number })
    @ApiBody({ type: UpdateSpeciesDto, required: false })
    async updateSpecie(
        @Param('id') specieId: number, @Body() updatedData: UpdateSpeciesDto
    ): Promise<Partial<OneOfItems>> {
        if (updatedData.url && await this.speciesService.isItemUrlExists(updatedData.url)) {
            throw new HttpException(`Url ${updatedData.url} is busied.`, 409);
        }

        let nonExistingUrls = await this.commonService.getNonExistingItemUrls(updatedData);
        if (nonExistingUrls.length > 0) {
            throw new HttpException(`${MESSAGE_ABOUT_NONEXISTENT_URLS} ${nonExistingUrls}`, 404);
        }

        let updatedSpecie = await this.speciesService.update(specieId, updatedData);

        let specieDataForResponse = this.speciesService.setItemDataForResponse(updatedSpecie);
        if (!specieDataForResponse) throw new HttpException('Unknown server error.', 500);

        return specieDataForResponse;
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Deleting a specie.'
    })
    @ApiParam({ type: Number, name: 'id', description: 'Specie id' })
    async deleteSpecie(@Param('id') specieId: number): Promise<Partial<OneOfItems>> {
        let specieToDelete = await this.speciesService.getItem(Number(specieId));

        if (!specieToDelete) throw new HttpException('Data not found.', 404);

        let deletedSpecie = await this.speciesService.deleteItem(Number(specieId));

        let specieDataForResponse = this.speciesService.setItemDataForResponse(deletedSpecie);
        if (!specieDataForResponse) throw new HttpException('Item not found.', 404);

        return specieDataForResponse;
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
    @ApiParam({ type: Number, name: 'id', description: 'Specie id' })
    async downloadImages(
        @Body() imagesData: ImagesDto, @Param('id') specieId: number): Promise<Partial<OneOfItems>> {
        let specie = await this.speciesService.getItem(Number(specieId));
        if (!specie) throw new HttpException('Specie not found.', 404);

        let specieplanetWithImages = await this.speciesService.downloadItemImages(imagesData, specie);
        let specieDataForResponse = this.speciesService.setItemDataForResponse(specieplanetWithImages);
        if (!specieDataForResponse) throw new HttpException('Unknown server error.', 500);

        return specieplanetWithImages;
    }

    @Delete(':specieId/images/:imageId')
    @ApiOperation({
        summary: 'Deleting an image.',
        description: `Removing links (urls) to images by specie and image identifiers.`
    })
    @ApiParam({ type: Number, name: 'specieId', description: 'Specie id' })
    @ApiParam({ type: Number, name: 'imageId', description: 'Image id' })
    async deleteImages(
        @Param('specieId') specieId: number,
        @Param('imageId') imageId: number
    ): Promise<Partial<OneOfItems>> {
        let specie = await this.speciesService.getItem(Number(specieId));
        if (!specie) throw new HttpException('Specie not found.', 404);

        let imageToDelete = await this.speciesService.getImage(Number(imageId));
        if (!imageToDelete) throw new HttpException('Image not found.', 404);

        await this.speciesService.deleteImage(imageId);

        let specieDataForResponse = this.speciesService.setItemDataForResponse(specie);

        return specieDataForResponse;
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Getting a specie.'
    })
    @ApiParam({ type: Number, name: 'id', description: 'Specie id' })
    async getSpecie(@Param('id') specieId: number): Promise<Partial<OneOfItems>> {
        let specie = await this.speciesService.getItem(Number(specieId));
        if (!specie) throw new HttpException('Specie not found.', 404);

        return this.speciesService.setItemDataForResponse(specie);
    }
}