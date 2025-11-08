import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { UserRole, UserStatus } from '../../models/user.model';

export class BaseUserFieldsDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  fullName?: string | null;

  @IsEmail()
  @IsOptional()
  email?: string | null;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  avatarUrl?: string | null;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  phone?: string | null;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  address?: string | null;

  @IsString()
  @IsOptional()
  bio?: string | null;
}

export class UpdateUserDto extends PartialType(BaseUserFieldsDto) {
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus;
}

export class UpdateUserRoleDto {
  @IsEnum(UserRole)
  role: UserRole;
}

export class UpdateUserStatusDto {
  @IsEnum(UserStatus)
  status: UserStatus;
}

