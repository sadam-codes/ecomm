import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Product } from '../models/product.model';
import { User } from '../models/user.model';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const nodeEnv = configService.get<string>('NODE_ENV') || 'development';

        return {
          dialect: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: Number(configService.get<string>('DB_PORT')),
          username: configService.get<string>('DB_USER'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
          logging: nodeEnv !== 'production' ? console.log : false,
          pool: {
            max: 20,
            min: 5,
            acquire: 30000,
            idle: 10000,
          },
          models: [Product, User],
          autoLoadModels: true,
          synchronize: nodeEnv !== 'production',
          alter: nodeEnv !== 'production',
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [SequelizeModule],
})
export class DatabaseModule {}
