import { Body, Controller, Delete, Get, HttpException, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PlanetsService } from './planets.service';
import { CreatePlanetsDto } from './dto/create_planets.dto';
import { UpdatePlanetsDto } from './dto/update_planets.rto';
import { ImagesDto } from 'src/common/dto/images.dto';
import { PeopleService } from 'src/people/people.service';
import { FilmsService } from 'src/films/films.service';
import { MESSAGE_ABOUT_NONEXISTENT_URLS } from 'src/common/constants';
import { ItemTypes, OneOfResponseTypes } from 'src/common/types/types';
import { SpeciesService } from 'src/species/species.service';
console.log('PlanetsController')

@ApiTags('Planets')
@Controller('planets')
export class PlanetsController {
    constructor(
        private planetsService: PlanetsService,
        private peopleService: PeopleService,
        private filmsService: FilmsService,
        private speciesService: SpeciesService,
    ) { }

    @Post()
    @ApiOperation({
        summary: 'Создание планеты.',
        description: `Для создания планеты необходимо передать тело запроса с обязательным полем <b>name</b>.<br>
        Поля доступные для заполнения: <b>name</b>, <b>rotation_period</b>, <b>orbital_period</b>, <b>diameter</b>, 
        <b>climate</b>, <b>gravity</b>, <b>terrain</b>, <b>surface_water</b>, <b>population</b>, <b>residents</b>, 
        <b>species</b>, <b>vehicles</b>, <b>starships</b>, <b>films</b>, <b>url</b>. 
        <br>
        Формат ввода можно посмотреть [тут](https://swapi.dev/api/planets/1/). <br>
        <b>Будте внимательны</b>, если вы не заполняете поле <b>url</b>, 
        то он сгенерируется автоматически уникальным значением. <br>
        Все поля могут быть не уникальны, кроме <b>url</b>. 
        Если вы введёте неуникальный <b>url</b>, планета не будет создана и вам вернётся соответсвующий ответ.
        <br><br>
        
    Пример запроса: \n
    {
    "name": "Zefira",
    "films": [ "https://swapi.dev/api/films/1/", "https://swapi.dev/api/films/2/" ],
    "url": "https://some-domain.dev/api/planets/98/"
    }
        `
    })
    @ApiBody({ type: CreatePlanetsDto, required: true })
    async createPlanet(@Body() data: CreatePlanetsDto): Promise<OneOfResponseTypes> {
        let unexistUrls = await this.getUnexistUrls(data);
        if (unexistUrls.length > 0) throw new HttpException(`${MESSAGE_ABOUT_NONEXISTENT_URLS} ${unexistUrls}`, 404);

        if (!(await this.planetsService.isItemUrlExists(data.url))) return await this.planetsService.create(data);

        throw new HttpException('Планета с таким url уже существует.', 409)

    }

    @Get()
    @ApiOperation({
        summary: 'Получение планет на странице.'
    })
    @ApiQuery({
        type: Number,
        name: 'page',
        description: 'Страница с планетами. Если значение не будет передано, будут получены первые 10 планет.',
        required: false,
        example: 1
    })
    async getPlanets(@Query('page') page: number): Promise<OneOfResponseTypes[]> {
        let totalPlanets = await this.planetsService.getTotal();
        let totalPlanetsOnThePage = 10;

        if (!page) return this.planetsService.getItemsFromThePage(1);

        if (page > totalPlanets / totalPlanetsOnThePage + 1 || page < 1) {
            let lastPage = (totalPlanets / totalPlanetsOnThePage);
            throw new HttpException(`Не найдено. Всего страниц: ${lastPage.toFixed(0)}`, 404);
        }

        return this.planetsService.getItemsFromThePage(page);
    }

    @Put(':id')
    @ApiOperation({
        summary: 'Обновление данных планеты.',
        description: `Чтобы передать данные для обновления, необходимо отправить 
        тело запроса. 
        Поля доступные для заполнения: <b>name</b>, <b>rotation_period</b>, <b>orbital_period</b>, <b>diameter</b>, 
        <b>climate</b>, <b>gravity</b>, <b>terrain</b>, <b>surface_water</b>, <b>population</b>, <b>residents</b>, 
        <b>species</b>, <b>vehicles</b>, <b>starships</b>, <b>films</b>, 
        <b>url</b>.
        <br>
        Формат ввода можно посмотреть [тут](https://swapi.dev/api/planets/1/). <br>
        <b>Будте внимательны</b>, если вы не заполняете поле <b>url</b>, 
        то он сгенерируется автоматически уникальным значением. <br>
        Все поля могут быть не уникальны, кроме <b>url</b>. 
        Если вы введёте неуникальный <b>url</b>, планета не будет создана и вам вернётся соответсвующий ответ.
        <br><br>
        
    Пример запроса: \n
    {
    "name": "Roma",
    "films": [ "https://swapi.dev/api/films/4/", "https://swapi.dev/api/films/3/" ],
    "url": "https://update-domain.dev/api/planets/98/"
    }
        `
    })
    @ApiParam({ name: 'id', description: 'Planet id', type: Number })
    @ApiBody({ type: UpdatePlanetsDto, required: false })
    async updatePerson(@Param('id') id: number, @Body() data: UpdatePlanetsDto): Promise<OneOfResponseTypes> {
        let unexistUrls = await this.getUnexistUrls(data);
        if (unexistUrls.length > 0) throw new HttpException(`${MESSAGE_ABOUT_NONEXISTENT_URLS} ${unexistUrls}`, 404);

        let planetIds = await this.planetsService.getAllItemIds();

        if (!planetIds.includes(Number(id))) throw new HttpException('Не найдено.', 404);

        if (!(await this.planetsService.isItemUrlExists(data.url))) return await this.planetsService.update(Number(id), data);

        throw new HttpException('Планета с таким url уже существует.', 409)
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
    @ApiParam({ type: Number, name: 'id', description: 'Planet id' })
    async downloadImages(@Body() data: ImagesDto, @Param('id') planetId: number): Promise<OneOfResponseTypes> {
        let planetIds = await this.planetsService.getAllItemIds();

        if (!planetIds.includes(Number(planetId))) throw new HttpException('Планета не найдена.', 404);

        return await this.planetsService.downloadItemImages(data, planetId)
    }

    @Delete(':planetId/images/:imageId')
    @ApiOperation({
        summary: 'Удаление изображения.',
        description: `Удаление ссылок (urls) на изображения по идентификаторам планеты и изображения.`
    })
    @ApiParam({ type: Number, name: 'planetId', description: 'Planet id' })
    @ApiParam({ type: Number, name: 'imageId', description: 'Image id' })
    async deleteImages(
        @Param('planetId') planetId: number,
        @Param('imageId') imageId: number
    ): Promise<OneOfResponseTypes> {
        let planetsIds = await this.planetsService.getAllItemIds();

        if (!planetsIds.includes(Number(planetId))) throw new HttpException('Планета не найдена.', 404);

        let allPlanetImagesIds = await this.planetsService.getItemImageIds(Number(planetId));

        if (!allPlanetImagesIds.includes(Number(imageId))) {
            throw new HttpException('Изображение для выбранной планеты не найдено.', 404);
        }

        return await this.planetsService.deleteItemImage(Number(planetId), Number(imageId));
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Получение планеты.'
    })
    @ApiParam({ type: Number, name: 'id', description: 'Planet id' })
    async getPlanet(@Param('id') id: number): Promise<OneOfResponseTypes> {
        let allPlanetIds = await this.planetsService.getAllItemIds();
        if (!allPlanetIds.includes(Number(id))) throw new HttpException('Планета по такому id не найден.', 404);

        return await this.planetsService.setItemDataForResponse(Number(id));
    }

    async getUnexistUrls(data: CreatePlanetsDto): Promise<string[]> {
        let unexistUrls = [];
        for (let key in data) {
            let elem = data[key];
            if (Array.isArray(elem)) {
                if (elem.length > 0) switch (key) {
                    case 'residents': unexistUrls.push(...await this.peopleService.getItemNonExistingUrls(elem)); break;
                    case 'films': unexistUrls.push(...await this.filmsService.getItemNonExistingUrls(elem)); break;
                    case 'species': unexistUrls.push(...await this.speciesService.getItemNonExistingUrls(elem)); break;
                    default: break;
                }
            }
        }
        return unexistUrls;
    }
}
