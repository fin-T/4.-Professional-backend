import { Body, Controller, Delete, Get, HttpException, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PeopleService } from './people.service';
import { ImagesDto } from 'src/common/dto/images.dto';
import { CreatePeopleDto } from './dto/create_people.dto';
import { UpdatePeopleDto } from './dto/update_people.dto';
import { FilmsService } from 'src/films/films.service';
import { PlanetsService } from 'src/planets/planets.service';
import { MESSAGE_ABOUT_NONEXISTENT_URLS } from 'src/common/constants';
import { OneOfItemTypes, OneOfResponseTypes } from 'src/common/types/types';
import { SpeciesService } from 'src/species/species.service';
import { CommonService } from 'src/common/common.service';
console.log('PeopleController')
@ApiTags('People')
@Controller('people')
export class PeopleController {
    constructor(
        private peopleService: PeopleService,
        private filmsService: FilmsService,
        private planetsService: PlanetsService,
        private speciesService: SpeciesService,
        private commonService: CommonService,
    ) { }

    @Post()
    @ApiOperation({
        summary: 'Создание человека.',
        description: `Для создания человека необходимо передать тело запроса с обязательным полем <b>name</b>.<br>
        Поля доступные для заполнения: <b>name</b>, <b>height</b>, <b>mass</b>, <b>hair_color</b>, <b>skin_color</b>, 
        <b>eye_color</b>, <b>birth_year</b>, <b>gender</b>, <b>homeworld</b>, <b>species</b>, <b>vehicles</b>, 
        <b>starships</b>, <b>films</b>, <b>url</b>.
        <br>
        Фрмат ввода можно посмотреть [тут](https://swapi.dev/api/people/1/). <br>
        <b>Будте внимательны</b>, если вы не заполняете поле <b>url</b>, 
        то он сгенерируется автоматически уникальным значением. <br>
        Все поля могут быть не уникальны, кроме <b>url</b>. 
        Если вы введёте неуникальный <b>url</b>, человек не будет создан и вам вернётся соответсвующий ответ.
        <br><br>
        
    Пример запроса: \n
    {
    "name": "Roma",
    "films": [ "https://swapi.dev/api/films/1/", "https://swapi.dev/api/films/2/" ],
    "url": "https://default-domain.dev/api/people/98/"
    }
        `
    })
    @ApiBody({ type: CreatePeopleDto, required: true })
    async createPerson(@Body() data: CreatePeopleDto): Promise<OneOfResponseTypes> {
        
        // let unexistingUrls = [];
        // for(let key in data) {
        //     let elem = data[key];
        //     if ()
        // }
        // if (unexistingUrls.length > 0) throw new HttpException(`${MESSAGE_ABOUT_NONEXISTENT_URLS} ${unexistingUrls}`, 404);

        if (data.url && !(await this.peopleService.isItemUrlExists(data.url))) {
            return await this.peopleService.create(data);
        }
        throw new HttpException('Человек с таким url уже существует.', 409)
    }

    @Get()
    @ApiOperation({
        summary: 'Получение людей на странице.'
    })
    @ApiQuery({
        type: Number,
        name: 'page',
        description: 'Страница с людьми. Если значение не будет передано, будут получены первые 10 людей.',
        required: false,
        example: 1

    })
    async getPeople(@Query('page') page: number): Promise<OneOfResponseTypes[]> {
        let totalPeople = await this.peopleService.getTotal();
        let totalPeopleOnThePage = 10;

        if (!page) return this.peopleService.getItemsFromThePage(1);

        if (page > totalPeople / totalPeopleOnThePage + 1 || page < 1) {
            let lastPage = totalPeople / totalPeopleOnThePage;
            throw new HttpException(`Не найдено. Всего есть страниц: ${lastPage.toFixed(0)}`, 404);
        }

        return await this.peopleService.getItemsFromThePage(page);
    }

    @Put(':id')
    @ApiOperation({
        summary: 'Обновление данных человека.',
        description: `Чтобы передать данные для обновления, необходимо отправить 
        тело запроса. 
        Поля доступные для заполнения: <b>name</b>, <b>height</b>, <b>mass</b>, <b>hair_color</b>, <b>skin_color</b>, 
        <b>eye_color</b>, <b>birth_year</b>, <b>gender</b>, <b>species</b>, <b>vehicles</b>, <b>starships</b>, 
        <b>films</b>, <b>homeworld</b>, <b>url</b>, 
        <b>images</b> (значение - массив url на изображения. Поддерживаемые форматы: jpg, jpeg, png, gif). 
        <br>
        Фрмат ввода можно посмотреть [тут](https://swapi.dev/api/people/1/). 
        <b>Будте внимательны</b>, если вы не заполняете поле <b>url</b>, 
        то он сгенерируется автоматически уникальным значением. <br>
        Все поля могут быть не уникальны, кроме <b>url</b>. 
        Если вы введёте неуникальный <b>url</b>, человек не будет создан и вам вернётся соответсвующий ответ.
        <br><br>
        
    Пример запроса: \n
    {
    "name": "Roma",
    "films": [ "https://swapi.dev/api/films/4/", "https://swapi.dev/api/films/4/" ]
    }
        `
    })
    @ApiParam({ name: 'id', description: 'Person id', type: Number })
    @ApiBody({ type: UpdatePeopleDto, required: false })
    async updatePerson(@Param('id') id: number, @Body() data: UpdatePeopleDto): Promise<OneOfResponseTypes> {
        let unexistUrls = await this.getUnexistUrls(data);
        if (unexistUrls.length > 0) throw new HttpException(`${MESSAGE_ABOUT_NONEXISTENT_URLS} ${unexistUrls}`, 404);

        let peopleIds = await this.peopleService.getAllItemIds();

        if (!peopleIds.includes(Number(id))) throw new HttpException(`Не найдено.`, 404);

        if (!(await this.peopleService.isItemUrlExists(data.url))) return await this.peopleService.update(Number(id), data);

        throw new HttpException('Человек с таким url уже существует.', 409)
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Удаление человека.'
    })
    @ApiParam({ type: Number, name: 'id', description: 'Person id' })
    async deletePerson(@Param('id') id: number): Promise<void> {
        let peopleIds = await this.peopleService.getAllItemIds();

        if (!peopleIds.includes(Number(id))) throw new HttpException('Не найдено.', 404);

        if (await this.peopleService.deleteItem(Number(id)) === null) throw new HttpException('Не найдено.', 404);
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
    @ApiParam({ type: Number, name: 'id', description: 'Person id' })
    async downloadImages(@Body() data: ImagesDto, @Param('id') personId: number): Promise<OneOfResponseTypes> {
        let peopleIds = await this.peopleService.getAllItemIds();

        if (!peopleIds.includes(Number(personId))) throw new HttpException('Человек не найден.', 404);

        return await this.peopleService.downloadItemImages(data, personId)
    }

    @Delete(':personId/images/:imageId')
    @ApiOperation({
        summary: 'Удаление изображения.',
        description: `Удаление ссылок (urls) на изображения по идентификаторам человека и изображения.`
    })
    @ApiParam({ type: Number, name: 'personId', description: 'Person id' })
    @ApiParam({ type: Number, name: 'imageId', description: 'Image id' })
    async deleteImages(
        @Param('personId') personId: number,
        @Param('imageId') imageId: number
    ): Promise<OneOfResponseTypes> {
        let peopleIds = await this.peopleService.getAllItemIds();

        if (!peopleIds.includes(Number(personId))) throw new HttpException('Человек не найден.', 404);

        let allPersonImagesIds = await this.peopleService.getItemImageIds(Number(personId));

        if (!allPersonImagesIds.includes(Number(imageId))) {
            throw new HttpException('Изображение для выбранного человека не найдено.', 404);
        }

        return await this.peopleService.deleteItemImage(Number(personId), Number(imageId));
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Получение человека.'
    })
    @ApiParam({ type: Number, name: 'id', description: 'Person id' })
    async getPerson(@Param('id') id?: number): Promise<OneOfItemTypes> {
        let allPeopleIds = await this.peopleService.getAllItemIds();
        if (!allPeopleIds.includes(Number(id))) throw new HttpException('Человек по такому id не найден.', 404);

        let item = await this.peopleService.getItem(Number(id));
        return await this.peopleService.setItemDataForResponse(item);
    }

    async getUnexistUrls(data: CreatePeopleDto) {
        let unexistUrls = [];
        for (let key in data) {
            if (key === 'homeworld' && typeof data[key] === 'string') {
                unexistUrls.push(...await this.planetsService.getItemNonExistingUrls([data[key]]));
            }
            let elem = data[key];
            if (Array.isArray(elem)) {
                if (elem.length > 0) switch (key) {
                    case 'films': unexistUrls.push(...await this.filmsService.getItemNonExistingUrls(elem)); break;
                    case 'species': unexistUrls.push(...await this.speciesService.getItemNonExistingUrls(elem)); break;
                    default: break;
                }
            }
        }
        return unexistUrls;
    }
}



