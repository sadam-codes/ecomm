import { Sequelize } from 'sequelize-typescript';
import { ConfigService } from '@nestjs/config';
import { Product } from '../models/product.model';
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async (configService: ConfigService) => {
      console.log("DB HOST =", configService.get<string>('DB_HOST'));

      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: Number(configService.get<number>('DB_PORT')),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        logging: configService.get<string>('NODE_ENV') === 'development' ? console.log : false,
        pool: {
          max: 20,
          min: 5,
          acquire: 30000,
          idle: 10000,
        },
        models: [Product],
      });

      try {
        await sequelize.authenticate();
        console.log('Database connection established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
        throw error;
      }

      return sequelize;
    },
    inject: [ConfigService],
  },
];
