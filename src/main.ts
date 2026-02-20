import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // enlève les champs non définis dans DTO
      forbidNonWhitelisted: true, // rejette les champs inconnus
      transform: true, // convertit automatiquement types primitives
    }),
  );

  app.enableCors();
  await app.listen(3000);
  console.log(`Server running on http://localhost:3000`);
}
bootstrap();
