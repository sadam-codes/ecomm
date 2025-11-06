import {
  Controller,
  Get,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { UsersService } from './users.service';

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
    // Check if user is admin (you can implement your own admin check logic)
    const isAdmin = req?.user && req.user.role === 'admin';
    
    if (!isAdmin) {
      throw new UnauthorizedException('Admin access required');
    }

    return this.usersService.getAllUsers({ search, status, role });
  }
}
