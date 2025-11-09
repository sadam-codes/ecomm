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
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '5',
    @Req() req?: Request,
  ) {
    await this.ensureAdmin(req);
    const parsedPage = Number(page);
    const parsedLimit = Number(limit);

    return this.usersService.getAllUsers({
      search,
      status,
      role,
      page: Number.isFinite(parsedPage) ? parsedPage : 1,
      limit: Number.isFinite(parsedLimit) ? parsedLimit : 20,
    });
  }

  @Get('profile/:id')
  async getUserProfile(@Param('id') id: string) {
    return this.usersService.getOrCreateUserById(id);
  }

  @Get(':id')
  async getUser(@Param('id') id: string, @Req() req?: Request) {
    await this.ensureAdmin(req);
    return this.usersService.getUser(id);
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req?: Request,
  ) {
    await this.ensureAdmin(req);
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Patch(':id/role')
  async updateUserRole(
    @Param('id') id: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
    @Req() req?: Request,
  ) {
    await this.ensureAdmin(req);
    return this.usersService.updateUserRole(id, updateUserRoleDto);
  }

  @Patch(':id/status')
  async updateUserStatus(
    @Param('id') id: string,
    @Body() updateUserStatusDto: UpdateUserStatusDto,
    @Req() req?: Request,
  ) {
    await this.ensureAdmin(req);
    return this.usersService.updateUserStatus(id, updateUserStatusDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string, @Req() req?: Request) {
    await this.ensureAdmin(req);
    await this.usersService.remove(id);
    return { success: true };
  }

  private async ensureAdmin(req?: Request) {
    if (!req) {
      throw new UnauthorizedException('Admin access required');
    }

    if (req.user?.role === 'admin') {
      return;
    }

    const authHeader = req.headers?.authorization;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;

    if (!token) {
      throw new UnauthorizedException('Admin access required');
    }

    const resolvedUser = await this.usersService.resolveUserFromToken(token);

    if (resolvedUser?.role === 'admin') {
      req.user = {
        id: resolvedUser.id,
        email: resolvedUser.email,
        role: resolvedUser.role,
      };
      return;
    }

    throw new UnauthorizedException('Admin access required');
  }
}
