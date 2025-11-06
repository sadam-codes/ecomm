import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Req,
  UseInterceptors,
  Body,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductCategory, ProductStatus } from '../models/product.model';

@Controller('/api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FilesInterceptor('images', 10)) // Accept up to 10 files
  async create(
    @Req() request: any,
    @UploadedFiles() files: Express.Multer.File[]
  ): Promise<Product> {
    try {
      console.log('Received request body:', request.body);
      console.log('Files received:', files?.length || 0);

      // Extract and validate form data from request body
      const price = parseFloat(request.body.price);
      const stock = parseInt(request.body.stock);
      const discount = request.body.discount ? parseFloat(request.body.discount) : undefined;

      // Validate required fields
      if (!request.body.name || request.body.name.trim() === '') {
        throw new BadRequestException('Product name is required');
      }

      if (isNaN(price) || price <= 0) {
        throw new BadRequestException('Valid price is required');
      }

      if (isNaN(stock) || stock < 0) {
        throw new BadRequestException('Valid stock quantity is required');
      }

      if (discount !== undefined && (isNaN(discount) || discount < 0)) {
        throw new BadRequestException('Valid discount is required');
      }

      // Validate category
      if (!Object.values(ProductCategory).includes(request.body.category)) {
        throw new BadRequestException(`Invalid category. Must be one of: ${Object.values(ProductCategory).join(', ')}`);
      }

      // Validate status
      if (!Object.values(ProductStatus).includes(request.body.status)) {
        throw new BadRequestException(`Invalid status. Must be one of: ${Object.values(ProductStatus).join(', ')}`);
      }

      const createProductDto: CreateProductDto = {
        name: request.body.name.trim(),
        description: request.body.description,
        price: price,
        stock: stock,
        category: request.body.category,
        status: request.body.status,
        brand: request.body.brand,
        model: request.body.model,
        discount: discount,
        // Images are handled via @UploadedFiles() decorator, not from request.body
        specifications: request.body.specifications ? (() => {
          try {
            return JSON.parse(request.body.specifications);
          } catch (error) {
            throw new BadRequestException('Invalid specifications format. Must be valid JSON.');
          }
        })() : undefined,
      };

      console.log('Parsed DTO:', createProductDto);

      return this.productsService.create(createProductDto, files);
    } catch (error) {
      console.error('Error in controller:', error);
      throw error;
    }
  }

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('category') category?: ProductCategory,
    @Query('status') status?: ProductStatus,
    @Query('search') search?: string,
  ): Promise<{ products: Product[]; total: number; totalPages: number }> {
    return this.productsService.findAll(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
      category,
      status,
      search,
    );
  }

  @Get('stats')
  async getStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    outOfStock: number;
    watches: number;
    shoes: number;
  }> {
    return this.productsService.getStats();
  }

  @Get('category/:category')
  async findByCategory(
    @Param('category') category: ProductCategory,
  ): Promise<Product[]> {
    return this.productsService.findByCategory(category);
  }
  
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images', 10)) // Accept up to 10 files
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: any,
    @UploadedFiles() files: Express.Multer.File[]
  ): Promise<Product> {
    // Extract form data from request body
    const updateProductDto: UpdateProductDto = {};
    if (request.body.name !== undefined) updateProductDto.name = request.body.name;
    if (request.body.description !== undefined) updateProductDto.description = request.body.description;
    if (request.body.price !== undefined) updateProductDto.price = parseFloat(request.body.price);
    if (request.body.stock !== undefined) updateProductDto.stock = parseInt(request.body.stock);
    if (request.body.category !== undefined) updateProductDto.category = request.body.category;
    if (request.body.status !== undefined) updateProductDto.status = request.body.status;
    if (request.body.brand !== undefined) updateProductDto.brand = request.body.brand;
    if (request.body.model !== undefined) updateProductDto.model = request.body.model;
    if (request.body.discount !== undefined) updateProductDto.discount = request.body.discount ? parseFloat(request.body.discount) : undefined;
    if (request.body.images !== undefined) updateProductDto.images = request.body.images;
    if (request.body.specifications !== undefined) updateProductDto.specifications = request.body.specifications ? JSON.parse(request.body.specifications) : undefined;

    return this.productsService.update(id, updateProductDto, files);
  }

  @Patch(':id/stock')
  async updateStock(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { quantity: number },
  ): Promise<Product> {
    return this.productsService.updateStock(id, body.quantity);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.productsService.remove(id);
  }
}
