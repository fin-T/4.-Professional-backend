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
import { SpeciesService } from './species.service';
import {
  ApiOperation,
  ApiBody,
  ApiQuery,
  ApiParam,
  ApiTags,
  ApiConsumes,
} from '@nestjs/swagger';
import { OneOfItems } from './../common/types/types';
import { CreateSpeciesDto } from './dto/create_species.dto';
import { UpdateSpeciesDto } from './dto/update_spacies.dto';
import { MESSAGE_ABOUT_NONEXISTENT_URLS } from './../common/constants/constants';
import { CommonService } from './../common/common.service';
import { HttpExceptionFilter } from './../exeptionFilters/httpExeptionFilter';
import { Role } from './../common/enums/role.enum';
import { CreateUserDto } from './../auth/dto/create_user.dto';
import {
  CREATE,
  DELETE,
  DELETE_IMAGES,
  DOWNLOAD_IMAGES,
  UPDATE,
} from './descriptions/species.descriptions';
import { Roles } from './../auth/decorators/roles.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from './../auth/guards/roles.guard';
import { AuthGuard } from './../auth/guards/auth.guard';
console.log('SpeciesController');

@ApiTags('Species')
@Controller('species')
@UseGuards(AuthGuard, RolesGuard)
export class SpeciesController {
  constructor(
    private speciesService: SpeciesService,
    private commonService: CommonService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Creating specie.', description: CREATE })
  @ApiBody({ type: CreateSpeciesDto && CreateUserDto, required: true })
  @Roles(Role.Admin)
  async createSpecie(
    @Body() data: CreateSpeciesDto,
  ): Promise<Partial<OneOfItems>> {
    if (await this.speciesService.isItemUrlExists(data.url)) {
      throw new HttpException(
        'A specie with the same URL already exists.',
        409,
      );
    }

    const nonExistingUrls =
      await this.commonService.getNonExistingItemUrls(data);
    if (nonExistingUrls && nonExistingUrls.length > 0) {
      throw new HttpException(
        `${MESSAGE_ABOUT_NONEXISTENT_URLS} ${nonExistingUrls}`,
        404,
      );
    }

    const newSpecie = await this.speciesService.create(data);
    return this.speciesService.setItemDataForResponse(newSpecie);
  }

  @Get()
  @ApiOperation({ summary: 'Getting species on the page.' })
  @ApiQuery({
    type: Number,
    name: 'page',
    description:
      'Species page. If no value is passed, the first 10 species will be returned.',
    required: false,
    example: 1,
  })
  @Roles(Role.Admin, Role.User)
  async getSpecies(
    @Query('page') page?: number,
  ): Promise<Partial<OneOfItems>[]> {
    let species = [];
    if (!page) {
      species = await this.speciesService.getItemsFromThePage(1);
    } else {
      species = await this.speciesService.getItemsFromThePage(page);
    }

    if (species.length === 0)
      throw new HttpException('Species not found.', 404);

    const speciesForResponse = species.map((specie) => {
      return this.speciesService.setItemDataForResponse(specie);
    });

    return speciesForResponse;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Updating specie data.', description: UPDATE })
  @ApiParam({ name: 'id', description: 'Specie id', type: Number })
  @ApiBody({ type: UpdateSpeciesDto && CreateUserDto, required: true })
  @Roles(Role.Admin)
  async updateSpecie(
    @Param('id') specieId: number,
    @Body() updatedData: UpdateSpeciesDto,
  ): Promise<Partial<OneOfItems>> {
    const specieToUpdate = await this.speciesService.getItem(Number(specieId));
    if (!specieToUpdate) throw new BadRequestException('Specie not found');

    if (
      updatedData.url &&
      (await this.speciesService.isItemUrlExists(updatedData.url))
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

    const updatedSpecie = await this.speciesService.update(
      specieId,
      updatedData,
    );
    return this.speciesService.setItemDataForResponse(updatedSpecie);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deleting a specie.', description: DELETE })
  @ApiParam({ type: Number, name: 'id', description: 'Specie id' })
  @ApiBody({ type: CreateUserDto, required: true })
  @Roles(Role.Admin)
  async deleteSpecie(
    @Param('id') specieId: number,
  ): Promise<Partial<OneOfItems>> {
    const specieToDelete = await this.speciesService.getItem(Number(specieId));
    if (!specieToDelete) throw new HttpException('Data not found.', 404);

    const deletedSpecie = await this.speciesService.deleteItem(
      Number(specieId),
    );
    if (!deletedSpecie) throw new HttpException('Item not found.', 404);

    return this.speciesService.setItemDataForResponse(deletedSpecie);
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
    @Param('id') specieId: number,
  ): Promise<Partial<OneOfItems>> {
    const specie = await this.speciesService.getItem(Number(specieId));
    if (!specie) throw new HttpException('Specie not found.', 404);

    const specieplanetWithImages = await this.speciesService.downloadItemImages(
      files,
      specie,
    );

    return this.speciesService.setItemDataForResponse(specieplanetWithImages);
  }

  @Delete(':specieId/images/:imageId')
  @ApiOperation({ summary: 'Deleting an image.', description: DELETE_IMAGES })
  @ApiParam({ type: Number, name: 'specieId', description: 'Specie id' })
  @ApiParam({ type: Number, name: 'imageId', description: 'Image id' })
  @ApiBody({ type: CreateUserDto, required: true })
  @Roles(Role.Admin)
  async deleteImages(
    @Param('specieId') specieId: number,
    @Param('imageId') imageId: number,
  ): Promise<Partial<OneOfItems>> {
    const specie = await this.speciesService.getItem(Number(specieId));
    if (!specie) throw new HttpException('Specie not found.', 404);

    const imageToDelete = await this.speciesService.getImage(Number(imageId));
    if (!imageToDelete) throw new HttpException('Image not found.', 404);

    await this.speciesService.deleteImage(imageId);
    const specieWithoutImage = await this.speciesService.getItem(
      Number(specieId),
    );
    return this.speciesService.setItemDataForResponse(specieWithoutImage);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Getting a specie.' })
  @ApiParam({ type: Number, name: 'id', description: 'Specie id' })
  @Roles(Role.Admin, Role.User)
  async getSpecie(@Param('id') specieId: number): Promise<Partial<OneOfItems>> {
    const specie = await this.speciesService.getItem(Number(specieId));
    if (!specie) throw new HttpException('Specie not found.', 404);

    return this.speciesService.setItemDataForResponse(specie);
  }
}
