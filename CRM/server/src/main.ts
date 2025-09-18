import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'], 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', 
    allowedHeaders: 'Content-Type, Accept, Authorization', 
  });

  app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
  await app.listen(3001);
}
bootstrap();
