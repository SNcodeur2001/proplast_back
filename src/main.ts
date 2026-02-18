import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validation globale DTO
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  // CORS
  app.enableCors();

  // Logger (Nest déjà inclus)
  await app.listen(3000);
  console.log(`Server running on http://localhost:3000`);
}
bootstrap();
