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
  UseFilters,
  UseGuards,
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
import { FilmsService } from './films.service';
import { CreateFilmsDto } from './dto/create_films.dto';
import { UpdateFilmsDto } from './dto/update_films.dto';
import { OneOfItems } from './../common/types/types';
import { MESSAGE_ABOUT_NONEXISTENT_URLS } from './../common/constants/constants';
import { CommonService } from './../common/common.service';
import { HttpExceptionFilter } from './../exeptionFilters/httpExeptionFilter';
import { CreateUserDto } from './../auth/dto/create_user.dto';
import {
  CREATE,
  DELETE,
  DELETE_IMAGES,
  DOWNLOAD_IMAGES,
  UPDATE,
} from './descriptions/films.descriptions';
import { Role } from './../common/enums/role.enum';
import { Roles } from './../auth/decorators/roles.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from './../auth/guards/roles.guard';
import { AuthGuard } from './../auth/guards/auth.guard';
console.log('FilmsController');

@ApiTags('Films')
@Controller('films')
@UseGuards(AuthGuard, RolesGuard)
export class FilmsController {
  constructor(
    private filmsService: FilmsService,
    private commonService: CommonService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Creating the film.', description: CREATE })
  @ApiBody({ type: CreateFilmsDto && CreateUserDto, required: true })
  @Roles(Role.Admin)
  async createFilm(@Body() data: CreateFilmsDto): Promise<Partial<OneOfItems>> {
    if (await this.filmsService.isItemUrlExists(data.url)) {
      throw new HttpException('A film with the same URL already exists.', 409);
    }

    const nonExistingUrls =
      await this.commonService.getNonExistingItemUrls(data);
    if (nonExistingUrls && nonExistingUrls.length > 0) {
      throw new HttpException(
        `${MESSAGE_ABOUT_NONEXISTENT_URLS} ${nonExistingUrls}`,
        404,
      );
    }

    const newFilm = await this.filmsService.create(data);
    return this.filmsService.setItemDataForResponse(newFilm);
  }

  @Get()
  @ApiOperation({ summary: 'Getting films on the page.' })
  @ApiQuery({
    type: Number,
    name: 'page',
    description:
      'Movies page. If no value is passed, the first 10 movies will be returned.',
    required: false,
    example: 1,
  })
  @Roles(Role.User, Role.Admin)
  async getFilms(@Query('page') page?: number): Promise<Partial<OneOfItems>[]> {
    let films = [];
    if (!page) {
      films = await this.filmsService.getItemsFromThePage(1);
    } else {
      films = await this.filmsService.getItemsFromThePage(page);
    }

    if (films.length === 0) throw new HttpException('Films not found.', 404);

    const filmsForResponse = films.map((film) => {
      return this.filmsService.setItemDataForResponse(film);
    });

    return filmsForResponse;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Updating film data.', description: UPDATE })
  @ApiParam({ name: 'id', description: 'Film id', type: Number })
  @ApiBody({ type: UpdateFilmsDto && CreateUserDto, required: true })
  @Roles(Role.Admin)
  async updateFilm(
    @Param('id') filmId: number,
    @Body() updatedData: UpdateFilmsDto,
  ): Promise<Partial<OneOfItems>> {
    const filmToUpdate = await this.filmsService.getItem(Number(filmId));
    if (!filmToUpdate) throw new BadRequestException('Film not found');

    if (
      updatedData.url &&
      (await this.filmsService.isItemUrlExists(updatedData.url))
    ) {
      throw new HttpException(`Url ${updatedData.url} is busied.`, 409);
    }

    const nonExistingUrls =
      await this.commonService.getNonExistingItemUrls(updatedData);
    if (nonExistingUrls && nonExistingUrls.length > 0) {
      throw new HttpException(
        `${MESSAGE_ABOUT_NONEXISTENT_URLS} ${nonExistingUrls}`,
        404,
      );
    }

    const updatedFilm = await this.filmsService.update(filmId, updatedData);
    return this.filmsService.setItemDataForResponse(updatedFilm);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deleting a film.', description: DELETE })
  @ApiParam({ type: Number, name: 'id', description: 'Film id' })
  @ApiBody({ type: CreateUserDto, required: true })
  @Roles(Role.Admin)
  async deleteFilm(@Param('id') filmId: number): Promise<Partial<OneOfItems>> {
    const filmToDelete = await this.filmsService.getItem(Number(filmId));
    if (!filmToDelete) throw new HttpException('Data not found.', 404);

    const deletedFilm = await this.filmsService.deleteItem(Number(filmId));
    if (!deletedFilm) throw new HttpException('Item not found.', 404);

    return this.filmsService.setItemDataForResponse(deletedFilm);
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
    @Param('id') filmId: number,
  ): Promise<Partial<OneOfItems>> {
    const film = await this.filmsService.getItem(Number(filmId));
    if (!film) throw new HttpException('Film not found.', 404);

    const filmWithImages = await this.filmsService.downloadItemImages(
      files,
      film,
    );

    return this.filmsService.setItemDataForResponse(filmWithImages);
  }

  @Delete(':filmId/images/:imageId')
  @ApiOperation({ summary: 'Deleting an image.', description: DELETE_IMAGES })
  @ApiParam({ type: Number, name: 'filmId', description: 'Film id' })
  @ApiParam({ type: Number, name: 'imageId', description: 'Image id' })
  @ApiBody({ type: CreateUserDto, required: true })
  @Roles(Role.Admin)
  async deleteImages(
    @Param('filmId') filmId: number,
    @Param('imageId') imageId: number,
  ): Promise<Partial<OneOfItems>> {
    const film = await this.filmsService.getItem(Number(filmId));
    if (!film) throw new HttpException('Film not found.', 404);

    const imageToDelete = await this.filmsService.getImage(Number(imageId));
    if (!imageToDelete) throw new HttpException('Image not found.', 404);

    await this.filmsService.deleteImage(imageId);
    const filmWithoutImages = await this.filmsService.getItem(Number(filmId));
    return this.filmsService.setItemDataForResponse(filmWithoutImages);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Getting the film.' })
  @ApiParam({ type: Number, name: 'id', description: 'Film id' })
  @Roles(Role.Admin, Role.User)
  async getFilm(@Param('id') filmId: number): Promise<Partial<OneOfItems>> {
    const film = await this.filmsService.getItem(Number(filmId));
    if (!film) throw new HttpException('Film not found.', 404);

    return this.filmsService.setItemDataForResponse(film);
  }
}
