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
import { PlanetsService } from './planets.service';
import { CreatePlanetsDto } from './dto/create_planets.dto';
import { UpdatePlanetsDto } from './dto/update_planets.rto';
import { OneOfItems } from './../common/types/types';
import { MESSAGE_ABOUT_NONEXISTENT_URLS } from './../common/constants/constants';
import { CommonService } from './../common/common.service';
import {
  CREATE,
  DELETE,
  DELETE_IMAGES,
  DOWNLOAD_IMAGES,
  UPDATE,
} from './descriptions/planets.descriptions';
import { Roles } from './../auth/decorators/roles.decorator';
import { Role } from './../common/enums/role.enum';
import { FilesInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from './../auth/guards/roles.guard';
import { AuthGuard } from './../auth/guards/auth.guard';
console.log('PlanetsController');

@ApiTags('Planets')
@Controller('planets')
@UseGuards(AuthGuard, RolesGuard)
export class PlanetsController {
  constructor(
    private planetsService: PlanetsService,
    private commonService: CommonService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Creating planet.', description: CREATE })
  @ApiBody({ type: CreatePlanetsDto })
  @Roles(Role.Admin)
  async createPlanet(
    @Body() data: CreatePlanetsDto,
  ): Promise<Partial<OneOfItems>> {
    if (await this.planetsService.isItemUrlExists(data.url)) {
      throw new HttpException(
        'A planet with the same URL already exists.',
        409,
      );
    }

    const nonExistingUrls =
      await this.commonService.getNonExistingItemUrls(data);
    if (nonExistingUrls && nonExistingUrls && nonExistingUrls.length > 0) {
      throw new HttpException(
        `${MESSAGE_ABOUT_NONEXISTENT_URLS} ${nonExistingUrls}`,
        404,
      );
    }

    const newPlanet = await this.planetsService.create(data);
    return this.planetsService.setItemDataForResponse(newPlanet);
  }

  @Get()
  @ApiOperation({ summary: 'Getting planets on the page.' })
  @ApiQuery({
    type: Number,
    name: 'page',
    description:
      'Planets page. If no value is passed, the first 10 planets will be returned.',
    required: false,
    example: 1,
  })
  @Roles(Role.Admin, Role.User)
  async getPlanets(
    @Query('page') page?: number,
  ): Promise<Partial<OneOfItems>[]> {
    let planets = [];
    if (!page) {
      planets = await this.planetsService.getItemsFromThePage(1);
    } else {
      planets = await this.planetsService.getItemsFromThePage(page);
    }

    if (planets.length === 0)
      throw new HttpException('Planets not found.', 404);

    const planetsForResponse = planets.map((vehicle) => {
      return this.planetsService.setItemDataForResponse(vehicle);
    });

    return planetsForResponse;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Updating planet data.', description: UPDATE })
  @ApiParam({ name: 'id', description: 'Planet id', type: Number })
  @ApiBody({ type: UpdatePlanetsDto })
  @Roles(Role.Admin)
  async updatePlanet(
    @Param('id') planetId: number,
    @Body() updatedData: UpdatePlanetsDto,
  ): Promise<Partial<OneOfItems>> {
    const planetToUpdate = await this.planetsService.getItem(Number(planetId));
    if (!planetToUpdate) throw new BadRequestException('Planet not found');

    if (
      updatedData.url &&
      (await this.planetsService.isItemUrlExists(updatedData.url))
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

    const updatedPlanet = await this.planetsService.update(
      planetId,
      updatedData,
    );
    return this.planetsService.setItemDataForResponse(updatedPlanet);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deleting a planet.', description: DELETE })
  @ApiParam({ type: Number, name: 'id', description: 'Planet id' })
  @Roles(Role.Admin)
  async deletePlanet(
    @Param('id') planetId: number,
  ): Promise<Partial<OneOfItems>> {
    const planetToDelete = await this.planetsService.getItem(Number(planetId));

    if (!planetToDelete) throw new HttpException('Data not found.', 404);

    const deletedPlanet = await this.planetsService.deleteItem(
      Number(planetId),
    );
    if (!deletedPlanet) throw new HttpException('Item not found.', 404);

    return this.planetsService.setItemDataForResponse(deletedPlanet);
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
    @Param('id') planetId: number,
  ): Promise<Partial<OneOfItems>> {
    const planet = await this.planetsService.getItem(Number(planetId));
    if (!planet) throw new HttpException('Planet not found.', 404);

    const planetWithImages = await this.planetsService.downloadItemImages(
      files,
      planet,
    );

    return this.planetsService.setItemDataForResponse(planetWithImages);
  }

  @Delete(':planetId/images/:imageId')
  @ApiOperation({ summary: 'Deleting an image.', description: DELETE_IMAGES })
  @ApiParam({ type: Number, name: 'planetId', description: 'Planet id' })
  @ApiParam({ type: Number, name: 'imageId', description: 'Image id' })
  @Roles(Role.Admin)
  async deleteImages(
    @Param('planetId') planetId: number,
    @Param('imageId') imageId: number,
  ): Promise<Partial<OneOfItems>> {
    const planet = await this.planetsService.getItem(Number(planetId));
    if (!planet) throw new HttpException('Planet not found.', 404);

    const imageToDelete = await this.planetsService.getImage(Number(imageId));
    if (!imageToDelete) throw new HttpException('Image not found.', 404);

    await this.planetsService.deleteImage(imageId);

    const planetWithoutImage = await this.planetsService.getItem(
      Number(planetId),
    );
    return this.planetsService.setItemDataForResponse(planetWithoutImage);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Getting a planet.' })
  @ApiParam({ type: Number, name: 'id', description: 'Planet id' })
  @Roles(Role.Admin)
  async getPlanet(
    @Param('id') planetId?: number,
  ): Promise<Partial<OneOfItems>> {
    const planet = await this.planetsService.getItem(Number(planetId));
    if (!planet) throw new HttpException('Planet not found.', 404);

    return this.planetsService.setItemDataForResponse(planet);
  }
}
