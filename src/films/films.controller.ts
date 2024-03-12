import { Body, Controller, Delete, Get, HttpException, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FilmsService } from './films.service';
import { CreateFilmsDto } from './dto/create_films.dto';
import { ImagesDto } from 'src/common/dto/images.dto';
import { UpdateFilmsDto } from './dto/update_films.dto';
import { OneOfItems } from 'src/common/types/types';
import { MESSAGE_ABOUT_NONEXISTENT_URLS } from 'src/common/constants/constants';
import { CommonService } from 'src/common/common.service';
console.log('FilmsController');

@ApiTags('Films')
@Controller('films')
export class FilmsController {
    constructor(
        private filmsService: FilmsService,
        private commonService: CommonService
    ) { }

    @Post()
    @ApiOperation({
        summary: 'Creating the film.',
        description: `To create a movie, you must pass the request body with the required <b>title</b> field.<br>
        Fields available for filling: <b>title</b>, <b>episode_id</b>, <b>mass</b>, <b>opening_crawl</b>,
        <b>director</b>, <b>producer</b>, <b>release_date</b>, <b>characters</b>, <b>planets</b>,
        <b>species</b>, <b>vehicles</b>, <b>starships</b>, <b>url</b>.
        <br>
        The input format can be viewed [here](https://swapi.py4e.com/api/films/1/).
        <b>Be careful</b> if you do not fill in the <b>url</b> field,
        then it will be generated automatically with a unique value. <br>
        All fields may not be unique, except <b>url</b>.
        If you enter a non-unique <b>url</b>, the movie will not be created and the corresponding response will 
        be returned to you.
        <br><br>
        
    Example request: \n
    {
    "title": "Uvula",
    "characters": [ "https://swapi.dev/api/people/1/", "https://swapi.dev/api/people/12/" ],
    "url": "https://default-domain.dev/api/films/98/"
    }
        `
    })
    @ApiBody({ type: CreateFilmsDto, required: true })
    async createFilm(@Body() data: CreateFilmsDto): Promise<Partial<OneOfItems>> {
        if (await this.filmsService.isItemUrlExists(data.url)) {
            throw new HttpException('A film with the same URL already exists.', 409)
        }

        let unexistingUrls = await this.commonService.getNonExistingItemUrls(data);
        if (unexistingUrls.length > 0) {
            throw new HttpException(`${MESSAGE_ABOUT_NONEXISTENT_URLS} ${unexistingUrls}`, 404);
        }
        let newFilm = await this.filmsService.create(data);

        let filmDataForResponse = this.filmsService.setItemDataForResponse(newFilm);
        if (!filmDataForResponse) throw new HttpException('Unknown server error.', 500);

        return filmDataForResponse;
    }

    @Get()
    @ApiOperation({
        summary: 'Getting films on the page.'
    })
    @ApiQuery({
        type: Number,
        name: 'page',
        description: 'Movies page. If no value is passed, the first 10 movies will be returned.',
        required: false,
        example: 1

    })
    async getFilms(@Query('page') page?: number): Promise<Partial<OneOfItems>[]> {
        let films = [];
        if (!page) {
            films = await this.filmsService.getItemsFromThePage(1);
        } else {
            films = await this.filmsService.getItemsFromThePage(page);
        }

        if (films.length === 0) throw new HttpException('Films not found.', 404);

        if (!films) throw new HttpException('Unknown server error.', 500);

        let filmsForResponse = films.map((film) => {
            return this.filmsService.setItemDataForResponse(film)
        })

        return filmsForResponse;
    }

    @Put(':id')
    @ApiOperation({
        summary: 'Updating film data.',
        description: `To transfer data for updating, you must send
        request body.
        Fields available for filling: <b>title</b>, <b>episode_id</b>, <b>mass</b>, <b>opening_crawl</b>,
        <b>director</b>, <b>producer</b>, <b>release_date</b>, <b>characters</b>, <b>planets</b>,
        <b>species</b>, <b>vehicles</b>, <b>starships</b>, <b>url</b>.
        <br>
        The input format can be viewed [here](https://swapi.py4e.com/api/films/1/).
        <b>Be careful</b> if you do not fill in the <b>url</b> field,
        then it will be generated automatically with a unique value. <br>
        All fields may not be unique, except <b>url</b>.
        If you enter a non-unique <b>url</b>, the movie will not be created and the corresponding response will 
        be returned to you.
        <br><br>
        
    Example request: \n
    {
    "title": "Uvula",
    "characters": [ "https://swapi.dev/api/people/1/", "https://swapi.dev/api/people/12/" ],
    "url": "https://default-domain.dev/api/films/98/"
    }
        `
    })
    @ApiParam({ name: 'id', description: 'Film id', type: Number })
    @ApiBody({ type: UpdateFilmsDto, required: false })
    async updateFilm(@Param('id') filmId: number,
        @Body() updatedData: UpdateFilmsDto): Promise<Partial<OneOfItems>> {
        if (updatedData.url && await this.filmsService.isItemUrlExists(updatedData.url)) {
            throw new HttpException(`Url ${updatedData.url} is busied.`, 409);
        }

        let nonExistingUrls = await this.commonService.getNonExistingItemUrls(updatedData);
        if (nonExistingUrls.length > 0) {
            throw new HttpException(`${MESSAGE_ABOUT_NONEXISTENT_URLS} ${nonExistingUrls}`, 404);
        }

        let updatedFilm = await this.filmsService.update(filmId, updatedData);

        let filmDataForResponse = this.filmsService.setItemDataForResponse(updatedFilm);
        if (!filmDataForResponse) throw new HttpException('Unknown server error.', 500);

        return filmDataForResponse;
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Deleting a film.'
    })
    @ApiParam({ type: Number, name: 'id', description: 'Film id' })
    async deleteFilm(@Param('id') filmId: number): Promise<Partial<OneOfItems>> {
        let filmToDelete = await this.filmsService.getItem(Number(filmId));

        if (!filmToDelete) throw new HttpException('Data not found.', 404);

        let deletedFilm = await this.filmsService.deleteItem(Number(filmId));

        let filmDataForResponse = this.filmsService.setItemDataForResponse(deletedFilm);
        if (!filmDataForResponse) throw new HttpException('Item not found.', 404);

        return filmDataForResponse;
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
    @ApiParam({ type: Number, name: 'id', description: 'Film id' })
    async downloadImages(@Body() imagesData: ImagesDto, @Param('id') filmId: number): Promise<Partial<OneOfItems>> {
        let film = await this.filmsService.getItem(Number(filmId));
        if (!film) throw new HttpException('Film not found.', 404);

        let filmWithImages = await this.filmsService.downloadItemImages(imagesData, film);
        let filmDataForResponse = this.filmsService.setItemDataForResponse(filmWithImages);
        if (!filmDataForResponse) throw new HttpException('Unknown server error.', 500);

        return filmWithImages;
    }

    @Delete(':filmId/images/:imageId')
    @ApiOperation({
        summary: 'Deleting an image.',
        description: `Removing links (urls) to images by movie and image identifiers.`
    })
    @ApiParam({ type: Number, name: 'filmId', description: 'Film id' })
    @ApiParam({ type: Number, name: 'imageId', description: 'Image id' })
    async deleteImages(
        @Param('filmId') filmId: number,
        @Param('imageId') imageId: number
    ): Promise<Partial<OneOfItems>> {
        let film = await this.filmsService.getItem(Number(filmId));
        if (!film) throw new HttpException('Film not found.', 404);

        let imageToDelete = await this.filmsService.getImage(Number(imageId));
        if (!imageToDelete) throw new HttpException('Image not found.', 404);

        await this.filmsService.deleteImage(imageId);

        let filmDataForResponse = this.filmsService.setItemDataForResponse(film);

        return filmDataForResponse;
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Getting the film.'
    })
    @ApiParam({ type: Number, name: 'id', description: 'Film id' })
    async getPerson(@Param('id') filmId: number): Promise<Partial<OneOfItems>> {
        let film = await this.filmsService.getItem(Number(filmId));
        if (!film) throw new HttpException('Person not found.', 404);

        return this.filmsService.setItemDataForResponse(film);
    }
}