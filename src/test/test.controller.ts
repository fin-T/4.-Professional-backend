import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('test')
@Controller('test')
export class TestController {

    @Get('/asd')
    asd() {

    }

}
