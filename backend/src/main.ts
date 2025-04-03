import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as express from 'express';
import { join } from 'path';

dotenv.config()
//console.log('JWT_SECRET:', process.env.JWT_SECRET);
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));
  app.enableCors();
  
  // serving static files from uploads directory
  //app.use('/videos', express.static(join(__dirname, '..', 'uploads/videos')));
  await app.listen(process.env.PORT ?? 8000);
  console.log('🚀Server is running on port: 8000')
}
bootstrap();