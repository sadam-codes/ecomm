import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Default,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript';
import { Optional } from 'sequelize';

export enum ProductCategory {
  WATCHES = 'watches',
  SHOES = 'shoes',
}

export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  OUT_OF_STOCK = 'out_of_stock',
}

export interface ProductAttributes {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category: ProductCategory;
  status: ProductStatus;
  images: string[] | null;
  specifications: Record<string, any> | null;
  brand: string | null;
  model: string | null;
  discount: number | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export type ProductCreationAttributes = Optional<
  ProductAttributes,
  | 'id'
  | 'description'
  | 'images'
  | 'specifications'
  | 'brand'
  | 'model'
  | 'discount'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt'
>;

@Table({
  tableName: 'products',
  timestamps: true,
  paranoid: true,
})
export class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
    declare id: number;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
  })
  name: string;

  @AllowNull(true)
  @Column({
    type: DataType.TEXT,
  })
  description: string | null;

  @AllowNull(false)
  @Column({
    type: DataType.DECIMAL(10, 2),
  })
  price: number;

  @AllowNull(false)
  @Default(0)
  @Column({
    type: DataType.INTEGER,
  })
  stock: number;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM(...Object.values(ProductCategory)),
  })
  category: ProductCategory;

  @AllowNull(false)
  @Default(ProductStatus.ACTIVE)
  @Column({
    type: DataType.ENUM(...Object.values(ProductStatus)),
  })
  status: ProductStatus;

  @AllowNull(true)
  @Column({
    type: DataType.JSONB,
  })
  images: string[] | null;

  @AllowNull(true)
  @Column({
    type: DataType.JSONB,
  })
  specifications: Record<string, any> | null;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
  })
  brand: string | null;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
  })
  model: string | null;

  @AllowNull(true)
  @Column({
    type: DataType.DECIMAL(5, 2),
  })
  discount: number | null;

  @CreatedAt
  @Column({
    type: DataType.DATE,
  })
  declare createdAt: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
  })
  declare updatedAt: Date;

  @DeletedAt
  @Column({
    type: DataType.DATE,
  })
  declare deletedAt: Date | null;
}
