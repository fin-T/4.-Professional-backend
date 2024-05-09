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
import { StarshipsService } from './starships.service';
import { CreateStarshipsDto } from './dto/create_starships.dto';
import { OneOfItems } from './../common/types/types';
import { UpdateStarshipsDto } from './dto/update_starships.dto';
import { MESSAGE_ABOUT_NONEXISTENT_URLS } from './../common/constants/constants';
import { CommonService } from './../common/common.service';
import { HttpExceptionFilter } from './../exeptionFilters/httpExeptionFilter';
import { CreateUserDto } from './../auth/dto/create_user.dto';
import {
  CREATE,
  DELETE,
  DELETE_IMAGES,
  DOWNLOAD_IMAGES,
} from './descriptions/starships.descriptions';
import { Roles } from './../auth/decorators/roles.decorator';
import { Role } from './../common/enums/role.enum';
import { FilesInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';
console.log('StarshipsController');

@ApiTags('Starships')
@Controller('starships')
@UseGuards(AuthGuard, RolesGuard)
export class StarshipsController {
  constructor(
    private starshipsService: StarshipsService,
    private commonService: CommonService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Creating starship.', description: CREATE })
  @ApiBody({ type: CreateStarshipsDto && CreateUserDto, required: true })
  @Roles(Role.Admin)
  async createStarship(
    @Body() data: CreateStarshipsDto,
  ): Promise<Partial<OneOfItems>> {
    if (await this.starshipsService.isItemUrlExists(data.url)) {
      throw new HttpException(
        'A starship with the same URL already exists.',
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

    const newStarship = await this.starshipsService.create(data);
    return this.starshipsService.setItemDataForResponse(newStarship);
  }

  @Get()
  @ApiOperation({
    summary: 'Getting starships on the page.',
  })
  @ApiQuery({
    type: Number,
    name: 'page',
    description:
      'Starships page. If no value is passed, the first 10 starships will be received.',
    required: false,
    example: 1,
  })
  @Roles(Role.Admin, Role.User)
  async getStarships(
    @Query('page') page?: number,
  ): Promise<Partial<OneOfItems>[]> {
    let starships = [];
    if (!page) {
      starships = await this.starshipsService.getItemsFromThePage(1);
    } else {
      starships = await this.starshipsService.getItemsFromThePage(page);
    }

    if (starships.length === 0)
      throw new HttpException('Starships not found.', 404);

    const starshipsForResponse = starships.map((starship) => {
      return this.starshipsService.setItemDataForResponse(starship);
    });

    return starshipsForResponse;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Updating starship data.', description: DELETE })
  @ApiParam({ name: 'id', description: 'Starship id', type: Number })
  @ApiBody({ type: UpdateStarshipsDto && CreateUserDto, required: true })
  @Roles(Role.Admin)
  async updateStarship(
    @Param('id') starshipId: number,
    @Body() updatedData: UpdateStarshipsDto,
  ): Promise<Partial<OneOfItems>> {
    const starshipToUpdate = await this.starshipsService.getItem(
      Number(starshipId),
    );
    if (!starshipToUpdate) throw new BadRequestException('Person not found');

    if (
      updatedData.url &&
      (await this.starshipsService.isItemUrlExists(updatedData.url))
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

    const updatedStarship = await this.starshipsService.update(
      starshipId,
      updatedData,
    );
    return this.starshipsService.setItemDataForResponse(updatedStarship);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deleting a starship.', description: DELETE })
  @ApiParam({ type: Number, name: 'id', description: 'Starship id' })
  @ApiBody({ type: CreateUserDto, required: true })
  @Roles(Role.Admin)
  async deleteStarship(
    @Param('id') starshipId: number,
  ): Promise<Partial<OneOfItems>> {
    const starshipToDelete = await this.starshipsService.getItem(
      Number(starshipId),
    );
    if (!starshipToDelete) throw new HttpException('Data not found.', 404);

    const deletedStarship = await this.starshipsService.deleteItem(
      Number(starshipId),
    );
    if (!deletedStarship) throw new HttpException('Item not found.', 404);

    return this.starshipsService.setItemDataForResponse(deletedStarship);
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
    @Param('id') starshipId: number,
  ): Promise<Partial<OneOfItems>> {
    const starship = await this.starshipsService.getItem(Number(starshipId));
    if (!starship) throw new HttpException('Starship not found.', 404);

    const starshipWithImages = await this.starshipsService.downloadItemImages(
      files,
      starship,
    );
    return this.starshipsService.setItemDataForResponse(starshipWithImages);
  }

  @Delete(':starshipId/images/:imageId')
  @ApiOperation({ summary: 'Deleting an image.', description: DELETE_IMAGES })
  @ApiParam({ type: Number, name: 'starshipId', description: 'Satrship id' })
  @ApiParam({ type: Number, name: 'imageId', description: 'Image id' })
  @ApiBody({ type: CreateUserDto, required: true })
  @Roles(Role.Admin)
  async deleteImages(
    @Param('starshipId') starshipId: number,
    @Param('imageId') imageId: number,
  ): Promise<Partial<OneOfItems>> {
    const starship = await this.starshipsService.getItem(Number(starshipId));
    if (!starship) throw new HttpException('Starship not found.', 404);

    const imageToDelete = await this.starshipsService.getImage(Number(imageId));
    if (!imageToDelete) throw new HttpException('Image not found.', 404);

    await this.starshipsService.deleteImage(imageId);
    const starshipsWithoutImage = await this.starshipsService.getItem(
      Number(starshipId),
    );
    return this.starshipsService.setItemDataForResponse(starshipsWithoutImage);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Getting a starship.' })
  @ApiParam({ type: Number, name: 'id', description: 'Starship id' })
  @Roles(Role.Admin, Role.User)
  async getStarship(
    @Param('id') starshipId: number,
  ): Promise<Partial<OneOfItems>> {
    const starship = await this.starshipsService.getItem(Number(starshipId));
    if (!starship) throw new HttpException('Starship not found.', 404);

    return this.starshipsService.setItemDataForResponse(starship);
  }
}
