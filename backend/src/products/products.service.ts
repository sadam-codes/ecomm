import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product, ProductCategory, ProductStatus } from '../models/product.model';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Op } from 'sequelize';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product)
    private productModel: typeof Product,
  ) {}

  async create(createProductDto: CreateProductDto, files?: Express.Multer.File[]): Promise<Product> {
    try {
      console.log('Creating product with DTO:', createProductDto);
      console.log('Files received in service:', files?.length || 0);

      // Process uploaded files - for now, we'll store them as base64 strings
      // In a real application, you would upload to cloud storage like AWS S3
      let imageUrls: string[] | null = null;

      if (files && files.length > 0) {
        imageUrls = files.map(file => {
          // Convert file buffer to base64 data URL for storage
          const base64 = file.buffer.toString('base64');
          return `data:${file.mimetype};base64,${base64}`;
        });
      }

      console.log('Image URLs:', imageUrls);

      const product = await this.productModel.create({
        name: createProductDto.name,
        description: createProductDto.description || null,
        price: createProductDto.price,
        stock: createProductDto.stock,
        category: createProductDto.category,
        status: createProductDto.status ?? ProductStatus.ACTIVE,
        images: imageUrls,
        specifications: createProductDto.specifications || null,
        brand: createProductDto.brand || null,
        model: createProductDto.model || null,
        discount: createProductDto.discount || null,
      });

      console.log('Product created successfully:', product.id);
      return product;
    } catch (error) {
      console.error('Error creating product in service:', error);
      throw new BadRequestException(`Failed to create product: ${error.message}`);
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    category?: ProductCategory,
    status?: ProductStatus,
    search?: string,
  ): Promise<{ products: Product[]; total: number; totalPages: number }> {
    const offset = (page - 1) * limit;
    const whereClause: any = {};

    if (category) {
      whereClause.category = category;
    }

    if (status) {
      whereClause.status = status;
    }

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { brand: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows } = await this.productModel.findAndCountAll({
      where: whereClause,
      offset,
      limit,
      order: [['createdAt', 'DESC']],
    });

    return {
      products: rows,
      total: count,
      totalPages: Math.ceil(count / limit),
    };
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productModel.findByPk(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto, files?: Express.Multer.File[]): Promise<Product> {
    const product = await this.findOne(id);
    try {
      const updateData: any = {};

      // Handle file uploads
      if (files && files.length > 0) {
        const imageUrls = files.map(file => {
          const base64 = file.buffer.toString('base64');
          return `data:${file.mimetype};base64,${base64}`;
        });
        updateData.images = imageUrls;
      }

      if (updateProductDto.name !== undefined) updateData.name = updateProductDto.name;
      if (updateProductDto.description !== undefined) updateData.description = updateProductDto.description || null;
      if (updateProductDto.price !== undefined) updateData.price = updateProductDto.price;
      if (updateProductDto.stock !== undefined) updateData.stock = updateProductDto.stock;
      if (updateProductDto.category !== undefined) updateData.category = updateProductDto.category;
      if (updateProductDto.status !== undefined) updateData.status = updateProductDto.status ?? ProductStatus.ACTIVE;
      if (updateProductDto.images !== undefined) updateData.images = updateProductDto.images || null;
      if (updateProductDto.specifications !== undefined) updateData.specifications = updateProductDto.specifications || null;
      if (updateProductDto.brand !== undefined) updateData.brand = updateProductDto.brand || null;
      if (updateProductDto.model !== undefined) updateData.model = updateProductDto.model || null;
      if (updateProductDto.discount !== undefined) updateData.discount = updateProductDto.discount || null;

      await product.update(updateData);
      return product.reload();
    } catch (error) {
      throw new BadRequestException('Failed to update product');
    }
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await product.destroy();
  }

  async findByCategory(category: ProductCategory): Promise<Product[]> {
    return this.productModel.findAll({
      where: { category },
      order: [['createdAt', 'DESC']],
    });
  }

  async updateStock(id: number, quantity: number): Promise<Product> {
    const product = await this.findOne(id);

    if (product.stock + quantity < 0) {
      throw new BadRequestException('Insufficient stock');
    }

    await product.update({ stock: product.stock + quantity });
    return product.reload();
  }

  async getStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    outOfStock: number;
    watches: number;
    shoes: number;
  }> {
    const total = await this.productModel.count();
    const active = await this.productModel.count({ where: { status: ProductStatus.ACTIVE } });
    const inactive = await this.productModel.count({ where: { status: ProductStatus.INACTIVE } });
    const outOfStock = await this.productModel.count({ where: { status: ProductStatus.OUT_OF_STOCK } });
    const watches = await this.productModel.count({ where: { category: ProductCategory.WATCHES } });
    const shoes = await this.productModel.count({ where: { category: ProductCategory.SHOES } });

    return {
      total,
      active,
      inactive,
      outOfStock,
      watches,
      shoes,
    };
  }
}
