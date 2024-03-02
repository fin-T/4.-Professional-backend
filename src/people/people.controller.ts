import { Body, Controller, Delete, Get, HttpException, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PeopleService } from './people.service';
import { ImagesDto } from 'src/common/dto/images.dto';
import { CreatePeopleDto } from './dto/create_people.dto';
import { People } from './entities/people.entity';
import { UpdatePeopleDto } from './dto/update_people.dto';
import { FilmsService } from 'src/films/films.service';
import { url } from 'inspector';

@ApiTags('People')
@Controller('people')
export class PeopleController {
    constructor(
        private peopleService: PeopleService,
        private filmsService: FilmsService
        ) { }

    @Post()
    @ApiOperation({
        summary: 'Создание человека.',
        description: `Для создания человека необходимо передать тело запроса с обязательным полем <b>name</b>.<br>
        Поля доступные для заполнения: <b>name</b>, <b>height</b>, <b>mass</b>, <b>hair_color</b>, <b>skin_color</b>, 
        <b>eye_color</b>, <b>birth_year</b>, <b>gender</b>, <b>films</b>, <b>url</b>. <br>
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
    async createPerson(@Body() data: CreatePeopleDto): Promise<People> {
        console.log(data);
        if (!(await this.peopleService.includes(data))) {
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
    async getPeople(@Query('page') page: number) {
        let totalPeople = await this.peopleService.getTotal();
        let totalPeopleOnThePage = 10;
        if (page > totalPeople / totalPeopleOnThePage + 1 || page < 1) {
            throw new HttpException('Не найдено.', 404);
        }
        return this.peopleService.getObjectsFromThePage(page);
    }

    @Put(':id')
    @ApiOperation({
        summary: 'Обновление данных человека.',
        description: `Чтобы передать данные для обновления, необходимо отправить 
        тело запроса. 
        Поля доступные для заполнения: <b>name</b>, <b>height</b>, <b>mass</b>, <b>hair_color</b>, <b>skin_color</b>, 
        <b>eye_color</b>, <b>birth_year</b>, <b>gender</b>, <b>films</b>, <b>url</b>. <br>
        Фрмат ввода можно посмотреть [тут](https://swapi.dev/api/people/1/). 
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
    @ApiParam({ name: 'id', description: 'Person id', type: Number })
    @ApiBody({ type: UpdatePeopleDto, required: false })
    async updatePerson(@Param('id') id: number, @Body() data: UpdatePeopleDto) {
        let peopleIds = await this.peopleService.getAllIds();
        if (!peopleIds.includes(Number(id))) throw new HttpException('Не найдено.', 404);
        if (!(await this.peopleService.includes(data))) {
            return await this.peopleService.update(Number(id), data);
        }
        throw new HttpException('Человек с таким url уже существует.', 409)
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Удаление человека.'
    })
    @ApiParam({ type: Number, name: 'id', description: 'Person id' })
    async deletePerson(@Param('id') id: number) {
        let peopleIds = await this.peopleService.getAllIds();
        if (!peopleIds.includes(Number(id))) throw new HttpException('Не найдено.', 404);
        await this.peopleService.delete(Number(id))
    }

    @Post(':id/images')
    @ApiOperation({
        summary: 'Загрузка изображений.',
        description: `Загрузка ссылок (urls) на изображения. <br>
        Поддерживаемые форматы: <i>"jpeg"</i>, <i>"jpg"</i>, <i>"png"</i>, <i>"gif"</i>. <br>
        Чтобы загрузить ссылки на изображения, нужно отправить тело запроса с полем <b>ursl</b>.<br><br>
        Пример запроса: \n
        {
            "urls": [ "https://domainname.12223.jpeg", "https://dsds.asdsad.12321.png"]
        }
        `
    })
    @ApiBody({ type: ImagesDto, required: false })
    @ApiParam({ type: Number, name: 'id', description: 'Person id' })
    async downloadImages(@Body() data: ImagesDto, @Param('id') personId: number) {
        let peopleIds = await this.peopleService.getAllIds();
        if (!peopleIds.includes(Number(personId))) throw new HttpException('Человек найден.', 404);
        console.log("AA")
        if (await this.peopleService.includesImage(data, personId)) {
            let allImageUrls = await this.peopleService.getAllImageUrls();
            let matchedUrls = allImageUrls.filter(url => data.urls.includes(url)).map(url => `'${url}'`);
            throw new HttpException(`Изображение с таким url уже существует. Matched image urls: [${matchedUrls}]`, 409);
        }
        return await this.peopleService.downloadImages(data, personId)
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
    ) {
        let peopleIds = await this.peopleService.getAllIds();
        let imageIds = await this.peopleService.getAllImageIds();
        if (!peopleIds.includes(Number(personId)) && !imageIds.includes(Number(imageId))) {
            throw new HttpException('Человек и изображение не найдены.', 404);
        } else if (!peopleIds.includes(Number(personId))) {
            throw new HttpException('Человек не найден.', 404);
        } else if (!imageIds.includes(Number(imageId))) throw new HttpException('Изображение не найдено.', 404);
        return await this.peopleService.deleteImage(Number(personId), Number(imageId));
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Получение человека.'
    })
    @ApiParam({ type: Number, name: 'id', description: 'Person id' })
    async getPerson(@Param('id') id: number) {
        return await this.peopleService.getPerson(id);
    }
}
