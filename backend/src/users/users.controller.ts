import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { UsersService } from './users.service';
import { UpdateUserDto, UpdateUserRoleDto, UpdateUserStatusDto } from './dto/update-user.dto';

@Controller('/api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers(
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('role') role?: string,
    @Req() req?: Request,
  ) {
    this.ensureAdmin(req);
    return this.usersService.getAllUsers({ search, status, role });
  }

  @Get(':id')
  async getUser(@Param('id') id: string, @Req() req?: Request) {
    this.ensureAdmin(req);
    return this.usersService.getUser(id);
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req?: Request,
  ) {
    this.ensureAdmin(req);
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Patch(':id/role')
  async updateUserRole(
    @Param('id') id: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
    @Req() req?: Request,
  ) {
    this.ensureAdmin(req);
    return this.usersService.updateUserRole(id, updateUserRoleDto);
  }

  @Patch(':id/status')
  async updateUserStatus(
    @Param('id') id: string,
    @Body() updateUserStatusDto: UpdateUserStatusDto,
    @Req() req?: Request,
  ) {
    this.ensureAdmin(req);
    return this.usersService.updateUserStatus(id, updateUserStatusDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string, @Req() req?: Request) {
    this.ensureAdmin(req);
    await this.usersService.remove(id);
    return { success: true };
  }

  private ensureAdmin(req?: Request) {
    const isAdmin = req?.user && req.user.role === 'admin';

    if (!isAdmin) {
      throw new UnauthorizedException('Admin access required');
    }
  }
}
