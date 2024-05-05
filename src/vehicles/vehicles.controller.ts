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
import { VehiclesService } from './vehicles.service';
import { CreateVehiclesDto } from './dto/create_vehicles.dto';
import { OneOfItems } from './../common/types/types';
import { UpdateVehiclesDto } from './dto/update_vehicles.dto';
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
} from './descriptions/vehicles.descriptions';
import { Roles } from './../auth/decorators/roles.decorator';
import { Role } from './../common/enums/role.enum';
import { FilesInterceptor } from '@nestjs/platform-express';
console.log('VehiclesController');

@ApiTags('Vehicles')
@Controller('vehicles')
@UseFilters(HttpExceptionFilter)
export class VehiclesController {
  constructor(
    private vehiclesService: VehiclesService,
    private commonService: CommonService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Creating vehicle.', description: CREATE })
  @ApiBody({ type: CreateVehiclesDto && CreateUserDto, required: true })
  @Roles(Role.Admin)
  async createVehicle(
    @Body() data: CreateVehiclesDto,
  ): Promise<Partial<OneOfItems>> {
    if (await this.vehiclesService.isItemUrlExists(data.url)) {
      throw new HttpException(
        'A vehicle with the same URL already exists.',
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

    const newVehicle = await this.vehiclesService.create(data);
    return this.vehiclesService.setItemDataForResponse(newVehicle);
  }

  @Get()
  @ApiOperation({ summary: 'Getting vehicles on the page.' })
  @ApiQuery({
    type: Number,
    name: 'page',
    description:
      'Page with vehicles. If no value is passed, the first 10 vehicles will be received.',
    required: false,
    example: 1,
  })
  @Roles(Role.Admin, Role.User)
  async getVehicles(
    @Query('page') page?: number,
  ): Promise<Partial<OneOfItems>[]> {
    let vehicle = [];
    if (!page) {
      vehicle = await this.vehiclesService.getItemsFromThePage(1);
    } else {
      vehicle = await this.vehiclesService.getItemsFromThePage(page);
    }

    if (vehicle.length === 0)
      throw new HttpException('Vehicles not found.', 404);

    const vehiclesForResponse = vehicle.map((vehicle) => {
      return this.vehiclesService.setItemDataForResponse(vehicle);
    });

    return vehiclesForResponse;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Updating vehicle data.', description: UPDATE })
  @ApiParam({ name: 'id', description: 'Vehicle id', type: Number })
  @ApiBody({ type: UpdateVehiclesDto && CreateUserDto, required: true })
  @Roles(Role.Admin)
  async updateVehicle(
    @Param('id') vehicleId: number,
    @Body() updatedData: UpdateVehiclesDto,
  ): Promise<Partial<OneOfItems>> {
    const vehicleToUpdate = await this.vehiclesService.getItem(
      Number(vehicleId),
    );
    if (!vehicleToUpdate) throw new BadRequestException('Vehicle not found');

    if (
      updatedData.url &&
      (await this.vehiclesService.isItemUrlExists(updatedData.url))
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

    const updatedVehicle = await this.vehiclesService.update(
      vehicleId,
      updatedData,
    );
    return this.vehiclesService.setItemDataForResponse(updatedVehicle);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Deleting a vehicle.',
    description: DELETE,
  })
  @ApiParam({ type: Number, name: 'id', description: 'Vehicle id' })
  @ApiBody({ type: CreateUserDto, required: true })
  @Roles(Role.Admin)
  async deleteVehicle(
    @Param('id') vehicleId: number,
  ): Promise<Partial<OneOfItems>> {
    const vehicleToDelete = await this.vehiclesService.getItem(
      Number(vehicleId),
    );
    if (!vehicleToDelete) throw new HttpException('Data not found.', 404);

    const deletedVehicle = await this.vehiclesService.deleteItem(
      Number(vehicleId),
    );
    if (!deletedVehicle) throw new HttpException('Item not found.', 404);

    return this.vehiclesService.setItemDataForResponse(deletedVehicle);
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
    @Param('id') vehicleId: number,
  ): Promise<Partial<OneOfItems>> {
    const vehicle = await this.vehiclesService.getItem(Number(vehicleId));
    if (!vehicle) throw new HttpException('Vehicle not found.', 404);

    const vehicleWithImages = await this.vehiclesService.downloadItemImages(
      files,
      vehicle,
    );
    return this.vehiclesService.setItemDataForResponse(vehicleWithImages);
  }

  @Delete(':vehicleId/images/:imageId')
  @ApiOperation({ summary: 'Deleting an image.', description: DELETE_IMAGES })
  @ApiParam({ type: Number, name: 'vehicleId', description: 'Vehicle id' })
  @ApiParam({ type: Number, name: 'imageId', description: 'Image id' })
  @ApiBody({ type: CreateUserDto, required: true })
  @Roles(Role.Admin)
  async deleteImages(
    @Param('vehicleId') vehicleId: number,
    @Param('imageId') imageId: number,
  ): Promise<Partial<OneOfItems>> {
    const vehicle = await this.vehiclesService.getItem(Number(vehicleId));
    if (!vehicle) throw new HttpException('Vehicle not found.', 404);

    const imageToDelete = await this.vehiclesService.getImage(Number(imageId));
    if (!imageToDelete) throw new HttpException('Image not found.', 404);

    await this.vehiclesService.deleteImage(imageId);
    const vehicleWithoutImage = await this.vehiclesService.getItem(
      Number(vehicleId),
    );
    return this.vehiclesService.setItemDataForResponse(vehicleWithoutImage);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Getting a vehicle.',
  })
  @ApiParam({ type: Number, name: 'id', description: 'Vehicle id' })
  @Roles(Role.Admin, Role.User)
  async getPerson(
    @Param('id') vehicleId: number,
  ): Promise<Partial<OneOfItems>> {
    const vehicle = await this.vehiclesService.getItem(Number(vehicleId));
    if (!vehicle) throw new HttpException('Vehicle not found.', 404);

    return this.vehiclesService.setItemDataForResponse(vehicle);
  }
}
