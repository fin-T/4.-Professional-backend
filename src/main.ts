import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { downloadDataToDB } from './dbinitializer/dbinitializer';
import { RequestInterceptor } from './interceptors/requestInterceptor';
import { HttpExceptionFilter } from './exeptionFilters/httpExeptionFilter';
console.log('Main');
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.useGlobalInterceptors(new RequestInterceptor());

  // Downloading data to DB for project work.
  await downloadDataToDB(app);

  const config = new DocumentBuilder()
    .setTitle('SWapi')
    .setDescription('The Star wars apis')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, {
    jsonDocumentUrl: 'openapi.jsof',
  });

  // For global using exeption filters.
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3000);
}

bootstrap();
