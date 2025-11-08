import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript';
import { Optional } from 'sequelize';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export interface UserAttributes {
  id: string;
  email: string;
  passwordHash: string | null;
  fullName: string | null;
  avatarUrl: string | null;
  phone: string | null;
  address: string | null;
  bio: string | null;
  role: UserRole;
  status: UserStatus;
  emailConfirmedAt: Date | null;
  lastSignInAt: Date | null;
  appMetadata: Record<string, any> | null;
  userMetadata: Record<string, any> | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export type UserCreationAttributes = Optional<
  UserAttributes,
  | 'passwordHash'
  | 'fullName'
  | 'avatarUrl'
  | 'phone'
  | 'address'
  | 'bio'
  | 'role'
  | 'status'
  | 'emailConfirmedAt'
  | 'lastSignInAt'
  | 'appMetadata'
  | 'userMetadata'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt'
>;

@Table({
  tableName: 'users',
  timestamps: true,
  paranoid: true,
})
export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
  })
  declare id: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    unique: true,
  })
  email: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
    field: 'password_hash',
  })
  passwordHash: string | null;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
    field: 'full_name',
  })
  fullName: string | null;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
    field: 'avatar_url',
  })
  avatarUrl: string | null;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
  })
  phone: string | null;

  @AllowNull(true)
  @Column({
    type: DataType.TEXT,
  })
  address: string | null;

  @AllowNull(true)
  @Column({
    type: DataType.TEXT,
  })
  bio: string | null;

  @AllowNull(false)
  @Default(UserRole.USER)
  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
  })
  role: UserRole;

  @AllowNull(false)
  @Default(UserStatus.ACTIVE)
  @Column({
    type: DataType.ENUM(...Object.values(UserStatus)),
  })
  status: UserStatus;

  @AllowNull(true)
  @Column({
    type: DataType.DATE,
    field: 'email_confirmed_at',
  })
  emailConfirmedAt: Date | null;

  @AllowNull(true)
  @Column({
    type: DataType.DATE,
    field: 'last_sign_in_at',
  })
  lastSignInAt: Date | null;

  @AllowNull(true)
  @Default(null)
  @Column({
    type: DataType.JSONB,
    field: 'app_metadata',
  })
  appMetadata: Record<string, any> | null;

  @AllowNull(true)
  @Default(null)
  @Column({
    type: DataType.JSONB,
    field: 'user_metadata',
  })
  userMetadata: Record<string, any> | null;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: 'created_at',
  })
  declare createdAt: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    field: 'updated_at',
  })
  declare updatedAt: Date;

  @DeletedAt
  @Column({
    type: DataType.DATE,
    field: 'deleted_at',
  })
  declare deletedAt: Date | null;
}

