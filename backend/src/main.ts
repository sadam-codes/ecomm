import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });
  const PORT = configService.get<number>('PORT') || 3000;
  const dbUrl = configService.get<string>('DATABASE_URL');

  await app.listen(PORT);

  console.log(`🚀 Server is running on: http://localhost:${PORT}`);
  if (dbUrl) {
    console.log(`✅ Connected to database: ${dbUrl}`);
  } else {
    console.error('❌ DATABASE_URL is not defined in .env');
  }
}
bootstrap();
