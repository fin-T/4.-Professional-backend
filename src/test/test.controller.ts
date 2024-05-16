import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Test')
@Controller('test')
export class TestController {

    @Get()
    @ApiOperation({ summary: "Let's say hello." })
    sayHello() {
        return { message: "Hello!" };
    }
}
