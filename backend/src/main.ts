import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  // Enable global validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable CORS for file uploads
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
  console.log(process.env.PORT);
  console.log(`Server is running on port ${process.env.PORT ?? 3000}`);
}
bootstrap();
