import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { createDB, downloadDataToDB } from './dbinitializer/dbinitializer';
import { RequestInterceptor } from './interceptors/requestInterceptor';
console.log('Main');
async function bootstrap() {
  await createDB();

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }),);
  
  app.useGlobalInterceptors(new RequestInterceptor())

  await downloadDataToDB(app);

  const config = new DocumentBuilder()
    .setTitle('SWapi')
    .setDescription('The Star wars apis')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, {
    jsonDocumentUrl: 'openapi.jsof'
  });

  await app.listen(3000);
}

bootstrap();
