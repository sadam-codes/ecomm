import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductsModule } from './products/products.module';
import { Product } from './models/product.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        dialect: 'postgres',
        host: 'aws-1-ap-southeast-1.pooler.supabase.com',
        port: 5432,
        username: 'postgres.qfsgfjyjcxgavsrqbgeu',
        password: 'sadam@123',
        database: 'postgres',
        autoLoadModels: true,
        synchronize: true,
        models: [Product],
      }),
    }),

    ProductsModule,
  ],
})
export class AppModule {}
