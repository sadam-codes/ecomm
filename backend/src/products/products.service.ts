import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from '../models/product.model';
import { CreateProductDto, UpdateProductDto } from '../dtos/productDto';
import { CreationAttributes } from 'sequelize'; // <-- import this

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product)
    private productModel: typeof Product,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    return await this.productModel.create(dto as CreationAttributes<Product>);
  }

  async findAll(): Promise<Product[]> {
    return await this.productModel.findAll();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productModel.findByPk(id);
    if (!product)
      throw new NotFoundException(`Product with ID ${id} not found`);
    return product;
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    return await product.update(dto);
  }

  async findByCategory(category: string): Promise<Product[]> {
    return await this.productModel.findAll({ where: { category } });
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await product.destroy();
  }
}
