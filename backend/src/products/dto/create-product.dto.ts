import { IsString, IsNumber, IsEnum, IsOptional, IsArray, Min, Max } from 'class-validator';
import { ProductCategory, ProductStatus } from '../../models/product.model';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsEnum(ProductCategory)
  category: ProductCategory;

  @IsEnum(ProductStatus)
  @IsOptional()
  status?: ProductStatus;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsOptional()
  specifications?: Record<string, any>;

  @IsString()
  @IsOptional()
  brand?: string;

  @IsString()
  @IsOptional()
  model?: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  discount?: number;
}
