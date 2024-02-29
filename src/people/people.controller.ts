import { Body, Controller, Delete, Get, HttpException, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PeopleService } from './people.service';
import { CreatePeopleDto } from './people.dto/create_people.dto';
import { UpdatePeopleDto } from './people.dto/update_people.dto';
import { ImagesDto } from 'src/common/dto/images.dto';

@ApiTags('People')
@Controller('people')
export class PeopleController {
    constructor(private peopleService: PeopleService) { }

    @Post()
    @ApiOperation({
        summary: 'Создание человека.',
        description: `Для создания человека необходимо передать тело запроса с обязательным полем <b>name</b>.<br>
        Поля которые доступны для заполнения можно посмотреть [тут](https://swapi.dev/api/people/1/).<br><br>
        Пример запроса: \n
        {
            "name": "Roma",
            "films": [ { "title": "New film title" } ]
        }`
    })
    @ApiBody({ type: CreatePeopleDto, required: true })
    async createPerson(@Body() data: CreatePeopleDto) {
        
        if (!(await this.peopleService.includes(data.name))) {
            let newPeople = await this.peopleService.create(data);
            await this.peopleService.save(newPeople);
            return newPeople;
        }
        throw new HttpException('Человек с таким именем уже существует.', 409)
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
        Поля которые доступны для заполнения можно посмотреть [тут](https://swapi.dev/api/people/1/).<br><br>
        Пример запроса: \n
        {
            "name": "Roma",
            "films": [ { "title": "New film title" } ]
        }`
    })
    @ApiParam({ name: 'id', description: 'Person id', type: Number })
    @ApiBody({ type: UpdatePeopleDto, required: false })
    async updatePerson(@Param('id') id: number, @Body() data: UpdatePeopleDto) {
        let peopleIds = await this.peopleService.getAllIds();
        if (!peopleIds.includes(Number(id))) throw new HttpException('Не найдено.', 404);
        return await this.peopleService.update(Number(id), data);
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
            "urls": [ "https://img2.joyreactor.12223.jpeg", "https://img2.joyreactor.12321.png"]
        }
        `
    })
    @ApiBody({ type: ImagesDto, required: false })
    @ApiParam({ type: Number, name: 'id', description: 'Person id' })
    async downloadImages(@Body() data: ImagesDto, @Param('id') id: number) {
        let peopleIds = await this.peopleService.getAllIds();
        if (!peopleIds.includes(Number(id))) throw new HttpException('Не найдено.', 404);
        await this.peopleService.downloadImages(data, id)
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
        await this.peopleService.deleteImage(Number(personId), Number(imageId));
    }
}
