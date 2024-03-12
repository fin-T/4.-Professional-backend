import { Body, Controller, Delete, Get, HttpException, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { StarshipsService } from './starships.service';
import { CreateStarshipsDto } from './dto/create_starships.dto';
import { OneOfItems } from 'src/common/types/types';
import { UpdateStarshipsDto } from './dto/update_starships.dto';
import { ImagesDto } from 'src/common/dto/images.dto';
import { MESSAGE_ABOUT_NONEXISTENT_URLS } from 'src/common/constants/constants';
import { CommonService } from 'src/common/common.service';
console.log('StarshipsController');

@ApiTags('Starships')
@Controller('starships')
export class StarshipsController {
    constructor(
        private starshipsService: StarshipsService,
        private commonService: CommonService
    ) { }

    @Post()
    @ApiOperation({
        summary: 'Creating starship.',
        description: `To create a starship, you must pass the request body with the required field <b>name</b>.<br>
        Fields available for filling: <b>name</b>, <b>model</b>, <b>model</b>, <b>cost_in_credits</b>,
        <b>length</b>, <b>max_atmosphering_speed</b>, <b>crew</b>, <b>passengers</b>, <b>cargo_capacity</b>,
        <b>consumables</b>, <b>hyperdrive_rating</b>, <b>MGLT</b>, <b>starship_class</b>, <b>pilots</b>,
        <b>films</b>, <b>url</b>.
        <br>
        The input format can be viewed [here](https://swapi.py4e.com/api/starships/3/). <br>
        <b>Be careful</b> if you do not fill in the <b>url</b> field,
        then it will be generated automatically with a unique value. <br>
        All fields may not be unique, except <b>url</b>.
        If you enter a non-unique <b>url</b>, starship will not be created and the corresponding response will be 
        returned to you.
        <br><br>
        
    Example request: \n
    {
    "name": "Piratship",
    "films": [ "https://swapi.py4e.com/api/films/1/", "https://swapi.py4e.com/api/films/2/" ],
    "url": "https://default-domain.dev/api/starships/98/"
    }
        `
    })
    @ApiBody({ type: CreateStarshipsDto, required: true })
    async createStarship(@Body() data: CreateStarshipsDto): Promise<Partial<OneOfItems>> {
        if (await this.starshipsService.isItemUrlExists(data.url)) {
            throw new HttpException('A starship with the same URL already exists.', 409)
        }

        let unexistingUrls = await this.commonService.getNonExistingItemUrls(data);
        if (unexistingUrls.length > 0) {
            throw new HttpException(`${MESSAGE_ABOUT_NONEXISTENT_URLS} ${unexistingUrls}`, 404);
        }
        let newStarship = await this.starshipsService.create(data);

        let starshipDataForResponse = this.starshipsService.setItemDataForResponse(newStarship);
        if (!starshipDataForResponse) throw new HttpException('Unknown server error.', 500);

        return starshipDataForResponse;
    }

    @Get()
    @ApiOperation({
        summary: 'Getting starships on the page.'
    })
    @ApiQuery({
        type: Number,
        name: 'page',
        description: 'Starships page. If no value is passed, the first 10 starships will be received.',
        required: false,
        example: 1

    })
    async getStarships(@Query('page') page?: number): Promise<Partial<OneOfItems>[]> {
        let starships = [];
        if (!page) {
            starships = await this.starshipsService.getItemsFromThePage(1);
        } else {
            starships = await this.starshipsService.getItemsFromThePage(page);
        }

        if (starships.length === 0) throw new HttpException('Starships not found.', 404);

        if (!starships) throw new HttpException('Unknown server error.', 500);

        let starshipsForResponse = starships.map((starship) => {
            return this.starshipsService.setItemDataForResponse(starship)
        })

        return starshipsForResponse;
    }

    @Put(':id')
    @ApiOperation({
        summary: 'Updating starship data.',
        description: `To transfer data for updating, you must send
        request body.
        Fields available for filling: <b>name</b>, <b>model</b>, <b>model</b>, <b>cost_in_credits</b>,
        <b>length</b>, <b>max_atmosphering_speed</b>, <b>crew</b>, <b>passengers</b>, <b>cargo_capacity</b>,
        <b>consumables</b>, <b>hyperdrive_rating</b>, <b>MGLT</b>, <b>starship_class</b>, <b>pilots</b>,
        <b>films</b>, <b>url</b>.
        <br>
        The input format can be viewed [here](https://swapi.py4e.com/api/starships/3/). <br>
        <b>Be careful</b> if you do not fill in the <b>url</b> field,
        then it will be generated automatically with a unique value. <br>
        All fields may not be unique, except <b>url</b>.
        If you enter a non-unique <b>url</b>, starship will not be created and the corresponding response will be 
        returned to you.
        <br><br>
        
    Example request: \n
    {
    "name": "Piratship",
    "films": [ "https://swapi.py4e.com/api/films/1/", "https://swapi.py4e.com/api/films/2/" ]
    }
        `
    })
    @ApiParam({ name: 'id', description: 'Starship id', type: Number })
    @ApiBody({ type: UpdateStarshipsDto, required: false })
    async updateStarship(@Param('id') starshipId: number,
        @Body() updatedData: UpdateStarshipsDto): Promise<Partial<OneOfItems>> {
        if (updatedData.url && await this.starshipsService.isItemUrlExists(updatedData.url)) {
            throw new HttpException(`Url ${updatedData.url} is busied.`, 409);
        }

        let nonExistingUrls = await this.commonService.getNonExistingItemUrls(updatedData);
        if (nonExistingUrls.length > 0) {
            throw new HttpException(`${MESSAGE_ABOUT_NONEXISTENT_URLS} ${nonExistingUrls}`, 404);
        }

        let updatedStarship = await this.starshipsService.update(starshipId, updatedData);

        let starshipDataForResponse = this.starshipsService.setItemDataForResponse(updatedStarship);
        if (!starshipDataForResponse) throw new HttpException('Unknown server error.', 500);

        return starshipDataForResponse;
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Deleting a starship.'
    })
    @ApiParam({ type: Number, name: 'id', description: 'Starship id' })
    async deleteStarship(@Param('id') starshipId: number): Promise<Partial<OneOfItems>> {
        let starshipToDelete = await this.starshipsService.getItem(Number(starshipId));

        if (!starshipToDelete) throw new HttpException('Data not found.', 404);

        let deletedStarship = await this.starshipsService.deleteItem(Number(starshipId));

        let starshipDataForResponse = this.starshipsService.setItemDataForResponse(deletedStarship);
        if (!starshipDataForResponse) throw new HttpException('Item not found.', 404);

        return starshipDataForResponse;
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
    @ApiParam({ type: Number, name: 'id', description: 'Starship id' })
    async downloadImages(@Body() imagesData: ImagesDto,
        @Param('id') starshipId: number): Promise<Partial<OneOfItems>> {
        let starship = await this.starshipsService.getItem(Number(starshipId));
        if (!starship) throw new HttpException('Starship not found.', 404);

        let starshipWithImages = await this.starshipsService.downloadItemImages(imagesData, starship);
        let starshipDataForResponse = this.starshipsService.setItemDataForResponse(starshipWithImages);
        if (!starshipDataForResponse) throw new HttpException('Unknown server error.', 500);

        return starshipWithImages;
    }

    @Delete(':starshipId/images/:imageId')
    @ApiOperation({
        summary: 'Deleting an image.',
        description: `Removing links (urls) to images by starship and image identifiers.`
    })
    @ApiParam({ type: Number, name: 'starshipId', description: 'Satrship id' })
    @ApiParam({ type: Number, name: 'imageId', description: 'Image id' })
    async deleteImages(
        @Param('starshipId') starshipId: number,
        @Param('imageId') imageId: number
    ): Promise<Partial<OneOfItems>> {
        let starship = await this.starshipsService.getItem(Number(starshipId));
        if (!starship) throw new HttpException('Starship not found.', 404);

        let imageToDelete = await this.starshipsService.getImage(Number(imageId));
        if (!imageToDelete) throw new HttpException('Image not found.', 404);

        await this.starshipsService.deleteImage(imageId);

        let starshipDataForResponse = this.starshipsService.setItemDataForResponse(starship);

        return starshipDataForResponse;
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Getting a starship.'
    })
    @ApiParam({ type: Number, name: 'id', description: 'Starship id' })
    async getStarship(@Param('id') starshipId: number): Promise<Partial<OneOfItems>> {
        let starship = await this.starshipsService.getItem(Number(starshipId));
        if (!starship) throw new HttpException('Starship not found.', 404);

        return this.starshipsService.setItemDataForResponse(starship);
    }
}