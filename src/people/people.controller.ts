import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpException,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { PeopleService } from './people.service';
import { CreatePeopleDto } from './dto/create_people.dto';
import { UpdatePeopleDto } from './dto/update_people.dto';
import { OneOfItems } from './../common/types/types';
import { MESSAGE_ABOUT_NONEXISTENT_URLS } from './../common/constants/constants';
import { CommonService } from './../common/common.service';
import {
  CREATE,
  UPDATE,
  DELETE,
  DELETE_IMAGES,
  DOWNLOAD_IMAGES,
} from './descriptions/people.descriptions';
import { Roles } from './../auth/decorators/roles.decorator';
import { Role } from './../common/enums/role.enum';
import { FilesInterceptor } from '@nestjs/platform-express';

console.log('PeopleController');

@ApiTags('People')
@Controller('people')
// @UseGuards(AuthGuard, RolesGuard)
export class PeopleController {
  constructor(
    private peopleService: PeopleService,
    private commonService: CommonService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Creating person.', description: CREATE })
  @Roles(Role.Admin)
  async createPerson(
    @Body() data: CreatePeopleDto,
  ): Promise<Partial<OneOfItems>> {
    if (await this.peopleService.isItemUrlExists(data.url)) {
      throw new HttpException(
        'A person with the same URL already exists.',
        409,
      );
    }

    const unexistingUrls =
      await this.commonService.getNonExistingItemUrls(data);
    if (unexistingUrls && unexistingUrls.length > 0) {
      throw new HttpException(
        `${MESSAGE_ABOUT_NONEXISTENT_URLS} ${unexistingUrls}`,
        404,
      );
    }

    const newPerson = await this.peopleService.create(data);
    return this.peopleService.setItemDataForResponse(newPerson);
  }

  @Get()
  @ApiOperation({ summary: 'Getting people on the page.' })
  @ApiQuery({
    type: Number,
    name: 'page',
    description:
      'People page. If no value is passed, the first 10 people will be returned.',
    required: false,
    example: 1,
  })
  @Roles(Role.Admin, Role.User)
  async getPeople(
    @Query('page') page?: number,
  ): Promise<Partial<OneOfItems>[]> {
    let people = [];
    if (!page) {
      people = await this.peopleService.getItemsFromThePage(1);
    } else {
      people = await this.peopleService.getItemsFromThePage(page);
    }

    if (people.length === 0) throw new HttpException('People not found.', 404);

    const peopleForResponse = people.map((person) => {
      return this.peopleService.setItemDataForResponse(person);
    });

    return peopleForResponse;
  }

  @Put(':id')
  @ApiOperation({ summary: "Updating a person's data.", description: UPDATE })
  @Roles(Role.Admin)
  async updatePerson(
    @Param('id') personId: number,
    @Body() updatedData: UpdatePeopleDto,
  ): Promise<Partial<OneOfItems>> {
    const personToUpdate = await this.peopleService.getItem(Number(personId));
    if (!personToUpdate) throw new BadRequestException('Person not found');

    if (
      updatedData.url &&
      (await this.peopleService.isItemUrlExists(updatedData.url))
    ) {
      throw new HttpException(`Url ${updatedData.url} is busied.`, 409);
    }

    const nonExistingUrls =
      await this.commonService.getNonExistingItemUrls(updatedData);
    if (nonExistingUrls.length > 0) {
      throw new HttpException(
        `${MESSAGE_ABOUT_NONEXISTENT_URLS} ${nonExistingUrls}`,
        404,
      );
    }

    const updatedPerson = await this.peopleService.update(
      personId,
      updatedData,
    );
    return this.peopleService.setItemDataForResponse(updatedPerson);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deleting a person.', description: DELETE })
  @ApiParam({ type: Number, name: 'id', description: 'Person id' })
  @Roles(Role.Admin)
  async deletePerson(
    @Param('id') personId: number,
  ): Promise<Partial<OneOfItems>> {
    const personToDelete = await this.peopleService.getItem(Number(personId));
    if (!personToDelete) throw new HttpException('Data not found.', 404);

    const deletedPerson = await this.peopleService.deleteItem(Number(personId));
    if (!deletedPerson) throw new HttpException('Item not found.', 404);

    return this.peopleService.setItemDataForResponse(deletedPerson);
  }

  @Post(':id/images')
  @ApiOperation({
    summary: 'Downloading images.',
    description: DOWNLOAD_IMAGES,
  })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ type: Number, name: 'id', description: 'Person id' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('files'))
  @Roles(Role.Admin)
  async downloadImages(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|gif)' }),
        ],
      }),
    )
    files: Express.Multer.File[],
    @Param('id') personId: number,
  ): Promise<Partial<OneOfItems>> {
    const person = await this.peopleService.getItem(Number(personId));
    if (!person) throw new HttpException('Person not found.', 404);

    const personWithImages = await this.peopleService.downloadItemImages(
      files,
      person,
    );

    return this.peopleService.setItemDataForResponse(personWithImages);
  }

  @Delete(':personId/images/:imageId')
  @ApiOperation({ summary: 'Deleting an image.', description: DELETE_IMAGES })
  @ApiParam({ type: Number, name: 'personId', description: 'Person id' })
  @ApiParam({ type: Number, name: 'imageId', description: 'Image id' })
  @Roles(Role.Admin)
  async deleteImages(
    @Param('personId') personId: number,
    @Param('imageId') imageId: number,
  ): Promise<Partial<OneOfItems>> {
    const person = await this.peopleService.getItem(Number(personId));
    if (!person) throw new HttpException('Person not found.', 404);

    const imageToDelete = await this.peopleService.getImage(Number(imageId));
    if (!imageToDelete) throw new HttpException('Image not found.', 404);

    await this.peopleService.deleteImage(imageId);

    const personWithoutImage = await this.peopleService.getItem(
      Number(personId),
    );
    return this.peopleService.setItemDataForResponse(personWithoutImage);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Getting person.' })
  @ApiParam({ type: Number, name: 'id', description: 'Person id' })
  @Roles(Role.Admin, Role.User)
  async getPerson(@Param('id') personId: number): Promise<Partial<OneOfItems>> {
    const person = await this.peopleService.getItem(Number(personId));
    if (!person) throw new HttpException('Person not found.', 404);

    return this.peopleService.setItemDataForResponse(person);
  }
}
