import { Body, Controller, Delete, Get, HttpException, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PeopleService } from './people.service';
import { ImagesDto } from 'src/common/dto/images.dto';
import { CreatePeopleDto } from './dto/create_people.dto';
import { UpdatePeopleDto } from './dto/update_people.dto';
import { OneOfItems } from 'src/common/types/types';
import { MESSAGE_ABOUT_NONEXISTENT_URLS } from 'src/common/constants/constants';
import { CommonService } from 'src/common/common.service';
console.log('PeopleController')

@ApiTags('People')
@Controller('people')
export class PeopleController {
    constructor(
        private peopleService: PeopleService,
        private commonService: CommonService
    ) { }

    @Post()
    @ApiOperation({
        summary: 'Creating person.',
        description: `To create a person, you must pass the request body with the required field <b>name</b>.<br>
        Fields available for filling: <b>name</b>, <b>height</b>, <b>mass</b>, <b>hair_color</b>, <b>skin_color</b>,
        <b>eye_color</b>, <b>birth_year</b>, <b>gender</b>, <b>homeworld</b>, <b>species</b>, <b>vehicles< /b>,
        <b>starships</b>, <b>films</b>, <b>url</b>.
        <br>
        The input format can be viewed [here](https://swapi.py4e.com/api/people/1/). <br>
        <b>Be careful</b> if you do not fill in the <b>url</b> field,
        then it will be generated automatically with a unique value. <br>
        All fields may not be unique, except <b>url</b>.
        If you enter a non-unique <b>url</b>, the person will not be created and the corresponding response will be 
        returned to you.
        <br><br>
        
    Example request: \n
    {
    "name": "Roma",
    "films": [ "https://swapi.py4e.com/api/films/1/", "https://swapi.py4e.com/api/films/2/" ],
    "url": "https://default-domain.dev/api/people/98/"
    }
        `
    })
    @ApiBody({ type: CreatePeopleDto, required: true })
    async createPerson(@Body() data: CreatePeopleDto): Promise<Partial<OneOfItems>> {
        if (await this.peopleService.isItemUrlExists(data.url)) {
            throw new HttpException('A person with the same URL already exists.', 409)
        }

        let unexistingUrls = await this.commonService.getNonExistingItemUrls(data);
        if (unexistingUrls.length > 0) {
            throw new HttpException(`${MESSAGE_ABOUT_NONEXISTENT_URLS} ${unexistingUrls}`, 404);
        }
        let newPerson = await this.peopleService.create(data);

        let personDataForResponse = this.peopleService.setItemDataForResponse(newPerson);
        if (!personDataForResponse) throw new HttpException('Unknown server error.', 500);

        return personDataForResponse;
    }

    @Get()
    @ApiOperation({
        summary: 'Getting people on the page.'
    })
    @ApiQuery({
        type: Number,
        name: 'page',
        description: 'People page. If no value is passed, the first 10 people will be returned.',
        required: false,
        example: 1

    })
    async getPeople(@Query('page') page?: number): Promise<Partial<OneOfItems>[]> {
        let people = [];
        if (!page) {
            people = await this.peopleService.getItemsFromThePage(1);
        } else {
            people = await this.peopleService.getItemsFromThePage(page);
        }

        if (people.length === 0) throw new HttpException('People not found.', 404);

        if (!people) throw new HttpException('Unknown server error.', 500);

        let peopleForResponse = people.map((person) => {
            return this.peopleService.setItemDataForResponse(person)
        })

        return peopleForResponse;
    }

    @Put(':id')
    @ApiOperation({
        summary: "Updating a person's data.",
        description: `To transfer data for updating, you must send
        request body.
        Fields available for filling: <b>name</b>, <b>height</b>, <b>mass</b>, <b>hair_color</b>, <b>skin_color</b>,
        <b>eye_color</b>, <b>birth_year</b>, <b>gender</b>, <b>species</b>, <b>vehicles</b>, <b>starships< /b>,
        <b>films</b>, <b>homeworld</b>, <b>url</b>,
        <b>images</b> (value is an array of urls for images. Supported formats: jpg, jpeg, png, gif).
        <br>
        The input format can be viewed [here](https://swapi.py4e.com/api/people/1/).
        <b>Be careful</b> if you do not fill in the <b>url</b> field,
        then it will be generated automatically with a unique value. <br>
        All fields may not be unique, except <b>url</b>.
        If you enter a non-unique <b>url</b>, the person will not be created and the corresponding response will be 
        returned to you.
        <br><br>
        
    Example request: \n
    {
    "name": "Roma",
    "films": [ "https://swapi.py4e.com/api/films/4/", "https://swapi.py4e.com/api/films/4/" ]
    }
        `
    })
    @ApiParam({ name: 'id', description: 'Person id', type: Number })
    @ApiBody({ type: UpdatePeopleDto, required: false })
    async updatePerson(
        @Param('id') personId: number, @Body() updatedData: UpdatePeopleDto
    ): Promise<Partial<OneOfItems>> {
        if (updatedData.url && await this.peopleService.isItemUrlExists(updatedData.url)) {
            throw new HttpException(`Url ${updatedData.url} is busied.`, 409);
        }

        let nonExistingUrls = await this.commonService.getNonExistingItemUrls(updatedData);
        if (nonExistingUrls.length > 0) {
            throw new HttpException(`${MESSAGE_ABOUT_NONEXISTENT_URLS} ${nonExistingUrls}`, 404);
        }

        let updatedPerson = await this.peopleService.update(personId, updatedData);

        let personDataForResponse = this.peopleService.setItemDataForResponse(updatedPerson);
        if (!personDataForResponse) throw new HttpException('Unknown server error.', 500);

        return personDataForResponse;
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Deleting a person.'
    })
    @ApiParam({ type: Number, name: 'id', description: 'Person id' })
    async deletePerson(@Param('id') personId: number): Promise<Partial<OneOfItems>> {
        let personToDelete = await this.peopleService.getItem(Number(personId));

        if (!personToDelete) throw new HttpException('Data not found.', 404);

        let deletedPerson = await this.peopleService.deleteItem(Number(personId));

        let personDataForResponse = this.peopleService.setItemDataForResponse(deletedPerson);
        if (!personDataForResponse) throw new HttpException('Item not found.', 404);

        return personDataForResponse;
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
    @ApiParam({ type: Number, name: 'id', description: 'Person id' })
    async downloadImages(@Body() imagesData: ImagesDto,
        @Param('id') personId: number): Promise<Partial<OneOfItems>> {
        let person = await this.peopleService.getItem(Number(personId));
        if (!person) throw new HttpException('Person not found.', 404);

        let personWithImages = await this.peopleService.downloadItemImages(imagesData, person);
        let personDataForResponse = this.peopleService.setItemDataForResponse(personWithImages);
        if (!personDataForResponse) throw new HttpException('Unknown server error.', 500);

        return personWithImages;
    }

    @Delete(':personId/images/:imageId')
    @ApiOperation({
        summary: 'Deleting an image.',
        description: `Removing links (urls) to images by person and image identifiers.`
    })
    @ApiParam({ type: Number, name: 'personId', description: 'Person id' })
    @ApiParam({ type: Number, name: 'imageId', description: 'Image id' })
    async deleteImages(
        @Param('personId') personId: number,
        @Param('imageId') imageId: number
    ): Promise<Partial<OneOfItems>> {
        let person = await this.peopleService.getItem(Number(personId));
        if (!person) throw new HttpException('Person not found.', 404);

        let imageToDelete = await this.peopleService.getImage(Number(imageId));
        if (!imageToDelete) throw new HttpException('Image not found.', 404);

        await this.peopleService.deleteImage(imageId);
        
        let personDataForResponse = this.peopleService.setItemDataForResponse(person);

        return personDataForResponse;
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Getting person.'
    })
    @ApiParam({ type: Number, name: 'id', description: 'Person id' })
    async getPerson(@Param('id') personId: number): Promise<Partial<OneOfItems>> {
        let person = await this.peopleService.getItem(Number(personId));
        if (!person) throw new HttpException('Person not found.', 404);

        return this.peopleService.setItemDataForResponse(person);
    }
}