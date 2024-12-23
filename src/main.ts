import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { VersioningType } from '@nestjs/common';
import { PinoLoggerAdapter } from './core/utils/logger';
import { writeFileSync } from 'fs';
import * as Redoc from 'redoc-express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
    abortOnError: false,
    cors: true,
  });

  app.useLogger(new PinoLoggerAdapter());

  app.enableVersioning({
    type: VersioningType.URI,
  });

  const config = new DocumentBuilder()
    .setTitle('Agriculture API')
    .setDescription('API for managing producers and farms')
    .setVersion('1.0')
    .addTag('Producers')
    .addTag('Farms')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  if (process.env.NODE_ENV === 'development') {
    writeFileSync('./openapi.json', JSON.stringify(document, null, 2));
  }

  SwaggerModule.setup('docs', app, document);

  app.getHttpAdapter().get('/openapi.json', (_, res) => res.json(document));

  app.use(
    '/redoc',
    Redoc.default({
      title: 'Agriculture API',
      specUrl: '/openapi.json',
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
