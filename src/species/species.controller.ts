import { Body, Controller, Delete, Get, HttpException, Param, Post, Put, Query } from '@nestjs/common';
import { FilmsService } from 'src/films/films.service';
import { PeopleService } from 'src/people/people.service';
import { PlanetsService } from 'src/planets/planets.service';
import { SpeciesService } from './species.service';
import { ApiOperation, ApiBody, ApiQuery, ApiParam, ApiTags } from '@nestjs/swagger';
import { MESSAGE_ABOUT_NONEXISTENT_URLS } from 'src/common/constants';
import { OneOfResponseTypes } from 'src/common/types/types';
import { CreateSpeciesDto } from './dto/create_species.dto';
import { UpdateSpeciesDto } from './dto/update_spacies.dto';
import { ImagesDto } from 'src/common/dto/images.dto';
console.log('SpeciesController')

@ApiTags('Species')
@Controller('species')
export class SpeciesController {
    constructor(
        private planetsService: PlanetsService,
        private peopleService: PeopleService,
        private filmsService: FilmsService,
        private speciesService: SpeciesService,
    ) { }

    @Post()
    @ApiOperation({
        summary: 'Создание specie.',
        description: `Для создания specie необходимо передать тело запроса с обязательным полем <b>name</b>.<br>
        Поля доступные для заполнения: <b>name</b>, <b>classification</b>, <b>designation</b>, <b>average_height</b>, 
        <b>skin_colors</b>, <b>hair_colors</b>, <b>eye_colors</b>, <b>average_lifespan</b>, <b>homeworld</b>, 
        <b>language</b>, <b>people</b>, <b>language</b>, <b>films</b>, <b>url</b>. 
        <br>
        Формат ввода можно посмотреть [тут](https://swapi.dev/api/species/1/). <br>
        <b>Будте внимательны</b>, если вы не заполняете поле <b>url</b>, 
        то он сгенерируется автоматически уникальным значением. <br>
        Все поля могут быть не уникальны, кроме <b>url</b>. 
        Если вы введёте неуникальный <b>url</b>, specie не будет создан и вам вернётся соответсвующий ответ.
        <br><br>
        
    Пример запроса: \n
    {
    "name": "Zefiradant",
    "films": [ "https://swapi.dev/api/films/1/", "https://swapi.dev/api/films/2/" ],
    "url": "https://some-domain.dev/api/species/98/"
    }
        `
    })
    @ApiBody({ type: CreateSpeciesDto, required: true })
    async createSpecie(@Body() data: CreateSpeciesDto): Promise<OneOfResponseTypes> {
        let unexistUrls = await this.getUnexistUrls(data);
        if (unexistUrls.length > 0) throw new HttpException(`${MESSAGE_ABOUT_NONEXISTENT_URLS} ${unexistUrls}`, 404);

        if (!(await this.speciesService.isItemUrlExists(data.url))) return await this.speciesService.create(data);

        throw new HttpException('Specie с таким url уже существует.', 409)

    }

    @Get()
    @ApiOperation({
        summary: 'Получение species на странице.'
    })
    @ApiQuery({
        type: Number,
        name: 'page',
        description: 'Страница с species. Если значение не будет передано, будут получены первые 10 species.',
        required: false,
        example: 1
    })
    async getSpecies(@Query('page') page: number): Promise<OneOfResponseTypes[]> {
        let totalSpecies = await this.speciesService.getTotal();
        let totalSpeciesOnThePage = 10;

        if (!page) return this.speciesService.getItemsFromThePage(1);

        if (page > totalSpecies / totalSpeciesOnThePage + 1 || page < 1) {
            let lastPage = (totalSpecies / totalSpeciesOnThePage);
            throw new HttpException(`Не найдено. Всего страниц: ${lastPage.toFixed(0)}`, 404);
        }

        return this.speciesService.getItemsFromThePage(page);
    }

    @Put(':id')
    @ApiOperation({
        summary: 'Обновление данных планеты.',
        description: `Чтобы передать данные для обновления, необходимо отправить 
        тело запроса. 
        Поля доступные для заполнения: <b>name</b>, <b>classification</b>, <b>designation</b>, <b>average_height</b>, 
        <b>skin_colors</b>, <b>hair_colors</b>, <b>eye_colors</b>, <b>average_lifespan</b>, <b>homeworld</b>, 
        <b>language</b>, <b>people</b>, <b>language</b>, <b>films</b>, <b>url</b>. 
        <br>
        Формат ввода можно посмотреть [тут](https://swapi.dev/api/species/1/). <br>
        <b>Будте внимательны</b>, если вы не заполняете поле <b>url</b>, 
        то он сгенерируется автоматически уникальным значением. <br>
        Все поля могут быть не уникальны, кроме <b>url</b>. 
        Если вы введёте неуникальный <b>url</b>, specie не будет создан и вам вернётся соответсвующий ответ.
        <br><br>
        
    Пример запроса: \n
    {
    "name": "Zefiradant",
    "films": [ "https://swapi.dev/api/films/1/", "https://swapi.dev/api/films/2/" ],
    "url": "https://some-domain.dev/api/species/98/"
    }
        `
    })
    @ApiParam({ name: 'id', description: 'Specie id', type: Number })
    @ApiBody({ type: UpdateSpeciesDto, required: false })
    async updateSpecie(@Param('id') id: number, @Body() data: UpdateSpeciesDto): Promise<OneOfResponseTypes> {
        let unexistUrls = await this.getUnexistUrls(data);
        if (unexistUrls.length > 0) throw new HttpException(`${MESSAGE_ABOUT_NONEXISTENT_URLS} ${unexistUrls}`, 404);

        let specieIds = await this.speciesService.getAllItemIds();

        if (!specieIds.includes(Number(id))) throw new HttpException('Не найдено.', 404);

        if (!(await this.speciesService.isItemUrlExists(data.url))) return await this.speciesService.update(Number(id), data);

        throw new HttpException('Specie с таким url уже существует.', 409)
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
    async downloadImages(@Body() data: ImagesDto, @Param('id') specieId: number): Promise<OneOfResponseTypes> {
        let specieIds = await this.speciesService.getAllItemIds();

        if (!specieIds.includes(Number(specieId))) throw new HttpException('Specie не найден.', 404);

        return await this.speciesService.downloadItemImages(data, specieId)
    }

    @Delete(':specieId/images/:imageId')
    @ApiOperation({
        summary: 'Удаление изображения.',
        description: `Удаление ссылок (urls) на изображения по идентификаторам specie и изображения.`
    })
    @ApiParam({ type: Number, name: 'specieId', description: 'Specie id' })
    @ApiParam({ type: Number, name: 'imageId', description: 'Image id' })
    async deleteImages(
        @Param('specieId') specieId: number,
        @Param('imageId') imageId: number
    ): Promise<OneOfResponseTypes> {
        let specieIds = await this.speciesService.getAllItemIds();

        if (!specieIds.includes(Number(specieId))) throw new HttpException('Specie не найдена.', 404);

        let allSpecieImagesIds = await this.speciesService.getItemImageIds(Number(specieId));

        if (!allSpecieImagesIds.includes(Number(imageId))) {
            throw new HttpException('Изображение для выбранной specie не найдено.', 404);
        }

        return await this.speciesService.deleteItemImage(Number(specieId), Number(imageId));
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Получение specie.'
    })
    @ApiParam({ type: Number, name: 'id', description: 'Specie id' })
    async getSpecie(@Param('id') id: number): Promise<OneOfResponseTypes> {
        let allSpesieIds = await this.planetsService.getAllItemIds();
        if (!allSpesieIds.includes(Number(id))) throw new HttpException('Specie по такому id не найден.', 404);

        return await this.speciesService.setItemDataForResponse(Number(id));
    }

    async getUnexistUrls(data: CreateSpeciesDto): Promise<string[]>{
        let unexistUrls = [];
        for (let key in data) {
            if (key === 'homeworld' && typeof data[key] === 'string') {
                unexistUrls.push(...await this.planetsService.getItemNonExistingUrls([data[key]]));
            } 
            let elem = data[key];
            if (Array.isArray(elem)) {
                if (elem.length > 0) switch (key) {
                    case 'people': unexistUrls.push(...await this.peopleService.getItemNonExistingUrls(elem)); break;
                    case 'films': unexistUrls.push(...await this.filmsService.getItemNonExistingUrls(elem)); break;
                    default: break;
                }
            }
        }
        return unexistUrls;
    }
}
