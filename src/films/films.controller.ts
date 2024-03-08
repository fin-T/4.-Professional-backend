import { Body, Controller, Delete, Get, HttpException, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FilmsService } from './films.service';
import { CreateFilmsDto } from './dto/create_films.dto';
import { ImagesDto } from 'src/common/dto/images.dto';
import { UpdateFilmsDto } from './dto/update_films.dto';
import { PeopleService } from 'src/people/people.service';
import { PlanetsService } from 'src/planets/planets.service';
import { MESSAGE_ABOUT_NONEXISTENT_URLS } from 'src/common/constants';
import { OneOfResponseTypes } from 'src/common/types/types';
import { SpeciesService } from 'src/species/species.service';
console.log('FilmsController');

@ApiTags('Films')
@Controller('films')
export class FilmsController {
    constructor(
        private filmsService: FilmsService,
        private peopleService: PeopleService,
        private planetsService: PlanetsService,
        private speciesService: SpeciesService,
    ) { }

    @Post()
    @ApiOperation({
        summary: 'Создание фильма.',
        description: `Для создания фильма необходимо передать тело запроса с обязательным полем <b>title</b>.<br>
        Поля доступные для заполнения: <b>title</b>, <b>episode_id</b>, <b>mass</b>, <b>opening_crawl</b>, 
        <b>director</b>, <b>producer</b>, <b>release_date</b>, <b>characters</b>, <b>planets</b>, 
        <b>species</b>, <b>vehicles</b>, <b>starships</b>, <b>url</b>.
        <br>
        Фрмат ввода можно посмотреть [тут](https://swapi.dev/api/films/1/).
        <b>Будте внимательны</b>, если вы не заполняете поле <b>url</b>, 
        то он сгенерируется автоматически уникальным значением. <br>
        Все поля могут быть не уникальны, кроме <b>url</b>. 
        Если вы введёте неуникальный <b>url</b>, фильм не будет создан и вам вернётся соответсвующий ответ.
        <br><br>
        
    Пример запроса: \n
    {
    "title": "Uvula",
    "characters": [ "https://swapi.dev/api/people/1/", "https://swapi.dev/api/people/12/" ],
    "url": "https://default-domain.dev/api/films/98/"
    }
        `
    })
    @ApiBody({ type: CreateFilmsDto, required: true })
    async createFilm(@Body() data: CreateFilmsDto): Promise<OneOfResponseTypes> {
        let unexistUrls = await this.getUnexistUrls(data);
        if (unexistUrls.length > 0) throw new HttpException(`${MESSAGE_ABOUT_NONEXISTENT_URLS} ${unexistUrls}`, 404);

        if (!(await this.filmsService.isItemUrlExists(data.url))) return await this.filmsService.create(data);

        throw new HttpException('Фильм с таким url уже существует.', 409)
    }

    @Get()
    @ApiOperation({
        summary: 'Получение фильмов на странице.'
    })
    @ApiQuery({
        type: Number,
        name: 'page',
        description: 'Страница с фильмами. Если значение не будет передано, будут получены первые 10 фильмов.',
        required: false,
        example: 1

    })
    async getFilms(@Query('page') page: number): Promise<OneOfResponseTypes[]> {
        let totalFilms = await this.filmsService.getTotal();
        let totalFilmsOnThePage = 10;

        if (!page) return this.filmsService.getItemsFromThePage(1);

        if (page > totalFilms / totalFilmsOnThePage + 1 || page < 1) {
            let lastPage = (totalFilms / totalFilmsOnThePage);
            throw new HttpException(`Не найдено. Всего страниц: ${lastPage.toFixed(0)}`, 404);
        }

        return this.filmsService.getItemsFromThePage(page);
    }

    @Put(':id')
    @ApiOperation({
        summary: 'Обновление данных фильма.',
        description: `Чтобы передать данные для обновления, необходимо отправить 
        тело запроса. 
        Поля доступные для заполнения: <b>title</b>, <b>episode_id</b>, <b>mass</b>, <b>opening_crawl</b>, 
        <b>director</b>, <b>producer</b>, <b>release_date</b>, <b>characters</b>, <b>planets</b>, 
        <b>species</b>, <b>vehicles</b>, <b>starships</b>, <b>url</b>.
        <br>
        Фрмат ввода можно посмотреть [тут](https://swapi.dev/api/films/1/).
        <b>Будте внимательны</b>, если вы не заполняете поле <b>url</b>, 
        то он сгенерируется автоматически уникальным значением. <br>
        Все поля могут быть не уникальны, кроме <b>url</b>. 
        Если вы введёте неуникальный <b>url</b>, фильм не будет создан и вам вернётся соответсвующий ответ.
        <br><br>
        
    Пример запроса: \n
    {
    "title": "Uvula",
    "characters": [ "https://swapi.dev/api/people/1/", "https://swapi.dev/api/people/12/" ],
    "url": "https://default-domain.dev/api/films/98/"
    }
        `
    })
    @ApiParam({ name: 'id', description: 'Film id', type: Number })
    @ApiBody({ type: UpdateFilmsDto, required: false })
    async updateFilm(@Param('id') id: number, @Body() data: UpdateFilmsDto): Promise<OneOfResponseTypes> {
        let unexistUrls = await this.getUnexistUrls(data);
        if (unexistUrls.length > 0) throw new HttpException(`${MESSAGE_ABOUT_NONEXISTENT_URLS} ${unexistUrls}`, 404);

        let filmsIds = await this.filmsService.getAllItemIds();

        if (!filmsIds.includes(Number(id))) throw new HttpException('Не найдено.', 404);

        if (!(await this.filmsService.isItemUrlExists(data.url))) return await this.filmsService.update(Number(id), data);

        throw new HttpException('Фильм с таким url уже существует.', 409)
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Удаление фильма.'
    })
    @ApiParam({ type: Number, name: 'id', description: 'Film id' })
    async deleteFilm(@Param('id') id: number): Promise<void> {
        let filmsIds = await this.filmsService.getAllItemIds();

        if (!filmsIds.includes(Number(id))) throw new HttpException('Не найдено.', 404);

        await this.filmsService.deleteItem(Number(id))
    }

    @Post(':id/images')
    @ApiOperation({
        summary: 'Загрузка изображений.',
        description: `Загрузка ссылок (urls) на изображения. <br>
        Поддерживаемые форматы: <i>"jpeg"</i>, <i>"jpg"</i>, <i>"png"</i>, <i>"gif"</i>. <br>
        Чтобы загрузить ссылки на изображения, нужно отправить тело запроса с полем <b>ursl</b>.
    
        <br><br>

    Пример запроса: \n
    {
    "urls": [ "https://domainname.12223.jpeg", "https://dsds.asdsad.12321.png"]
    }
        `
    })
    @ApiBody({ type: ImagesDto, required: false })
    @ApiParam({ type: Number, name: 'id', description: 'Film id' })
    async downloadImages(@Body() data: ImagesDto, @Param('id') filmId: number): Promise<OneOfResponseTypes> {
        let filmsIds = await this.filmsService.getAllItemIds();

        if (!filmsIds.includes(Number(filmId))) throw new HttpException('Человек найден.', 404);

        return await this.filmsService.downloadItemImages(data, filmId)
    }

    @Delete(':filmId/images/:imageId')
    @ApiOperation({
        summary: 'Удаление изображения.',
        description: `Удаление ссылок (urls) на изображения по идентификаторам фильма и изображения.`
    })
    @ApiParam({ type: Number, name: 'filmId', description: 'Film id' })
    @ApiParam({ type: Number, name: 'imageId', description: 'Image id' })
    async deleteImages(
        @Param('filmId') filmId: number,
        @Param('imageId') imageId: number
    ): Promise<OneOfResponseTypes> {
        let filmsIds = await this.filmsService.getAllItemIds();

        if (!filmsIds.includes(Number(filmId))) throw new HttpException('Фильм не найден.', 404);

        let allFilmImagesIds = await this.filmsService.getItemImageIds(Number(filmId));

        if (!allFilmImagesIds.includes(Number(imageId))) {
            throw new HttpException('Изображение для выбранного фильма не найдено.', 404);
        }

        return await this.filmsService.deleteItemImage(Number(filmId), Number(imageId));
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Получение фильма.'
    })
    @ApiParam({ type: Number, name: 'id', description: 'Film id' })
    async getPerson(@Param('id') id: number): Promise<OneOfResponseTypes> {
        let allPlanetsIds = await this.filmsService.getAllItemIds();
        if (!allPlanetsIds.includes(Number(id))) throw new HttpException('Фильм по такому id не найден.', 404);

        return await this.filmsService.setItemDataForResponse(Number(id));
    }

    async getUnexistUrls(data: CreateFilmsDto) {
        let unexistUrls = [];
        for (let key in data) {
            let elem = data[key];
            if (Array.isArray(elem)) {
                if (elem.length > 0) switch (key) {
                    case 'characters': unexistUrls.push(...await this.peopleService.getItemNonExistingUrls(elem)); break;
                    case 'planets': unexistUrls.push(...await this.planetsService.getItemNonExistingUrls(elem)); break;
                    case 'species': unexistUrls.push(...await this.speciesService.getItemNonExistingUrls(elem)); break;
                    default: break;
                }
            }
        }
        return unexistUrls;
    }
}

