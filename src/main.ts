import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import {
  ApiResponseDto,
  ErrorResponseDto,
  PagingResponseDto,
  SuccessResponseDto,
} from './common/dto/api-response.dto';
import { AllExceptionFilter } from './common/exception/all-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api/v1');

  // Validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Hanya properti yang ada di DTO yang diterima
      forbidUnknownValues: false,
      transform: true,
      validateCustomDecorators: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Cors
  app.enableCors();

  // Filter Exception
  app.useGlobalFilters(new AllExceptionFilter());

  // Logger
  app.useLogger(['log', 'error', 'warn', 'debug', 'verbose']);

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Moca Rental Movie')
    .setDescription('Documentation for Moca Rental Movie')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth')
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [
      SuccessResponseDto,
      ErrorResponseDto,
      ApiResponseDto,
      PagingResponseDto,
    ],
  });
  SwaggerModule.setup('/api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
