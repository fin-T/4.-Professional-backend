import {
    BadRequestException, Body, Catch, Controller, Delete, Get, HttpException,
    Param, Post, Put, Query, UseGuards
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PeopleService } from './people.service';
import { ImagesDto } from 'src/common/dto/images.dto';
import { CreatePeopleDto } from './dto/create_people.dto';
import { UpdatePeopleDto } from './dto/update_people.dto';
import { OneOfItems } from 'src/common/types/types';
import { MESSAGE_ABOUT_NONEXISTENT_URLS } from 'src/common/constants/constants';
import { CommonService } from 'src/common/common.service';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { RolesGuard } from 'src/guards/roles.guard';
import { CreateUserDto } from 'src/auth/dto/create_user.dto';
import { CREATE, UPDATE, DELETE, DELETE_IMAGES, DOWNLOAD_IMAGES } from './descriptions/people.descriptions';

console.log('PeopleController')

@Catch()
@ApiTags('People')
@Controller('people')
export class PeopleController {
    constructor(
        private peopleService: PeopleService,
        private commonService: CommonService
    ) { }

    @Post()
    @ApiOperation({ summary: 'Creating person.', description: CREATE })
    @ApiBody({ type: CreatePeopleDto && CreateUserDto, required: true })
    @UseGuards(LocalAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    async createPerson(@Body() data: CreatePeopleDto): Promise<Partial<OneOfItems>> {
        if (await this.peopleService.isItemUrlExists(data.url)) {
            throw new HttpException('A person with the same URL already exists.', 409)
        }

        let unexistingUrls = await this.commonService.getNonExistingItemUrls(data);
        if (unexistingUrls.length > 0) {
            throw new HttpException(`${MESSAGE_ABOUT_NONEXISTENT_URLS} ${unexistingUrls}`, 404);
        }

        let newPerson = await this.peopleService.create(data);
        return this.peopleService.setItemDataForResponse(newPerson);
    }

    @Get()
    @ApiOperation({ summary: 'Getting people on the page.' })
    @ApiQuery({
        type: Number, name: 'page',
        description: 'People page. If no value is passed, the first 10 people will be returned.',
        required: false, example: 1
    })
    @Roles(Role.User, Role.Admin)
    async getPeople(@Query('page') page?: number): Promise<Partial<OneOfItems>[]> {
        let people = [];
        if (!page) {
            people = await this.peopleService.getItemsFromThePage(1);
        } else {
            people = await this.peopleService.getItemsFromThePage(page);
        }

        if (people.length === 0) throw new HttpException('People not found.', 404);

        let peopleForResponse = people.map((person) => {
            return this.peopleService.setItemDataForResponse(person)
        })

        return peopleForResponse;
    }

    @Put(':id')
    @ApiOperation({ summary: "Updating a person's data.", description: UPDATE })
    @ApiParam({ name: 'id', description: 'Person id', type: Number })
    @ApiBody({ type: UpdatePeopleDto && CreateUserDto, required: true })
    @UseGuards(LocalAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    async updatePerson(@Param('id') personId: number,
        @Body() updatedData: UpdatePeopleDto): Promise<Partial<OneOfItems>> {
        let personToUpdate = await this.peopleService.getItem(Number(personId));
        if (!personToUpdate) throw new BadRequestException('Person not found');

        if (updatedData.url && await this.peopleService.isItemUrlExists(updatedData.url)) {
            throw new HttpException(`Url ${updatedData.url} is busied.`, 409);
        }

        let nonExistingUrls = await this.commonService.getNonExistingItemUrls(updatedData);
        if (nonExistingUrls.length > 0) {
            throw new HttpException(`${MESSAGE_ABOUT_NONEXISTENT_URLS} ${nonExistingUrls}`, 404);
        }

        let updatedPerson = await this.peopleService.update(personId, updatedData);
        return this.peopleService.setItemDataForResponse(updatedPerson);;
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Deleting a person.', description: DELETE })
    @ApiParam({ type: Number, name: 'id', description: 'Person id' })
    @ApiBody({ type: CreateUserDto, required: true })
    @UseGuards(LocalAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    async deletePerson(@Param('id') personId: number): Promise<Partial<OneOfItems>> {
        let personToDelete = await this.peopleService.getItem(Number(personId));
        if (!personToDelete) throw new HttpException('Data not found.', 404);

        let deletedPerson = await this.peopleService.deleteItem(Number(personId));
        if (!deletedPerson) throw new HttpException('Item not found.', 404);

        return this.peopleService.setItemDataForResponse(deletedPerson);
    }

    @Post(':id/images')
    @ApiOperation({ summary: 'Downloading images.', description: DOWNLOAD_IMAGES })
    @ApiBody({ type: ImagesDto && CreateUserDto, required: true })
    @ApiParam({ type: Number, name: 'id', description: 'Person id' })
    @UseGuards(LocalAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    async downloadImages(@Body() imagesData: ImagesDto,
        @Param('id') personId: number): Promise<Partial<OneOfItems>> {
        let person = await this.peopleService.getItem(Number(personId));
        if (!person) throw new HttpException('Person not found.', 404);

        let personWithImages = await this.peopleService.downloadItemImages(imagesData, person);
        return this.peopleService.setItemDataForResponse(personWithImages);
    }

    @Delete(':personId/images/:imageId')
    @ApiOperation({ summary: 'Deleting an image.', description: DELETE_IMAGES })
    @ApiParam({ type: Number, name: 'personId', description: 'Person id' })
    @ApiParam({ type: Number, name: 'imageId', description: 'Image id' })
    @ApiBody({ type: CreateUserDto, required: true })
    @UseGuards(LocalAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    async deleteImages(@Param('personId') personId: number,
        @Param('imageId') imageId: number): Promise<Partial<OneOfItems>> {
        let person = await this.peopleService.getItem(Number(personId));
        if (!person) throw new HttpException('Person not found.', 404);

        let imageToDelete = await this.peopleService.getImage(Number(imageId));
        if (!imageToDelete) throw new HttpException('Image not found.', 404);

        await this.peopleService.deleteImage(imageId);
        return this.peopleService.setItemDataForResponse(person);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Getting person.' })
    @ApiParam({ type: Number, name: 'id', description: 'Person id' })
    @Roles(Role.User, Role.Admin)
    async getPerson(@Param('id') personId: number): Promise<Partial<OneOfItems>> {
        let person = await this.peopleService.getItem(Number(personId));
        if (!person) throw new HttpException('Person not found.', 404);

        return this.peopleService.setItemDataForResponse(person);
    }
}