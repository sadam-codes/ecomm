import { Table, Column, Model, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript';

export enum ProductCategory {
  WATCHES = 'watches',
  SHOES = 'shoes',
}

export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  OUT_OF_STOCK = 'out_of_stock',
}

@Table({
  tableName: 'products',
  timestamps: true,
  paranoid: true,
})
export class Product extends Model<Product> {

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string | null;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  price: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  stock: number;

  @Column({
    type: DataType.ENUM(...Object.values(ProductCategory)),
    allowNull: false,
  })
  category: ProductCategory;

  @Column({
    type: DataType.ENUM(...Object.values(ProductStatus)),
    allowNull: false,
    defaultValue: ProductStatus.ACTIVE,
  })
  status: ProductStatus;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  images: string[] | null;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  specifications: Record<string, any> | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  brand: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  model: string | null;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: true,
  })
  discount: number | null;
}
