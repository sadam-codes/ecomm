import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { createClient } from '@supabase/supabase-js';
import { User, UserRole, UserStatus } from '../models/user.model';
import { Op } from 'sequelize';
import { UpdateUserDto, UpdateUserRoleDto, UpdateUserStatusDto } from './dto/update-user.dto';

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly logger = new Logger(UsersService.name);
  private supabaseAdmin;

  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_KEY) must be set in environment variables'
      );
    }
    
    this.supabaseAdmin = createClient(
      supabaseUrl,
      supabaseKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
  }

  async onModuleInit() {
    try {
      this.logger.log('Synchronizing Supabase users on startup...');
      const allUsers = await this.fetchAllSupabaseUsers();
      await this.syncSupabaseUsers(allUsers);
      this.logger.log(`Synchronized ${allUsers.length} users from Supabase.`);
    } catch (error) {
      this.logger.error('Failed to synchronize Supabase users on startup', error.stack);
    }
  }

  async getAllUsers(filters: { search?: string; status?: string; role?: string }) {
    try {
      await this.refreshFromSupabase();

      const where: any = {};

      if (filters.status) {
        const normalizedStatus = filters.status.toUpperCase() as keyof typeof UserStatus;
        if (UserStatus[normalizedStatus]) {
          where.status = UserStatus[normalizedStatus];
        }
      }

      if (filters.role) {
        const normalizedRole = filters.role.toUpperCase() as keyof typeof UserRole;
        if (UserRole[normalizedRole]) {
          where.role = UserRole[normalizedRole];
        }
      }

      if (filters.search) {
        const searchTerm = `%${filters.search}%`;
        where[Op.or] = [
          { fullName: { [Op.iLike]: searchTerm } },
          { email: { [Op.iLike]: searchTerm } },
        ];
      }

      const { rows, count } = await this.userModel.findAndCountAll({
        where,
        order: [['createdAt', 'DESC']],
      });

      return {
        users: rows.map(row => row.toJSON()),
        total: count,
      };
    } catch (error) {
      throw new Error(`Error fetching users: ${error.message}`);
    }
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async getUser(id: string) {
    const user = await this.findOne(id);
    return user.toJSON();
  }

  async getOrCreateUserById(id: string) {
    let user = await this.userModel.findByPk(id);
    if (user) {
      return user.toJSON();
    }

    const supabaseUser = await this.fetchSupabaseUserById(id);

    if (!supabaseUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    await this.syncSupabaseUsers([supabaseUser]);

    user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found after synchronization`);
    }

    return user.toJSON();
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    await user.update({ ...updateUserDto, email: updateUserDto.email ?? user.email });
    return user.toJSON();
  }

  async updateUserRole(id: string, updateUserRoleDto: UpdateUserRoleDto) {
    const user = await this.findOne(id);
    await user.update({ role: updateUserRoleDto.role });
    return user.toJSON();
  }

  async updateUserStatus(id: string, updateUserStatusDto: UpdateUserStatusDto) {
    const user = await this.findOne(id);
    await user.update({ status: updateUserStatusDto.status });
    return user.toJSON();
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await user.destroy();
  }

  private async refreshFromSupabase() {
    try {
      const allUsers = await this.fetchAllSupabaseUsers();
      if (allUsers.length) {
        await this.syncSupabaseUsers(allUsers);
      }
    } catch (error) {
      this.logger.error('Failed to refresh users from Supabase', error.stack);
    }
  }

  private async fetchAllSupabaseUsers() {
    const perPage = 100;
    let page = 1;
    const allUsers: Array<Record<string, any>> = [];

    while (true) {
      const { data, error } = await this.supabaseAdmin.auth.admin.listUsers({
        page,
        perPage,
      });

      if (error) {
        throw new Error(`Failed to fetch users from Supabase (page ${page}): ${error.message}`);
      }

      const users = data?.users ?? [];
      allUsers.push(...users);

      if (users.length < perPage) {
        break;
      }

      page += 1;
    }

    return allUsers;
  }

  private async syncSupabaseUsers(users: Array<Record<string, any>>) {
    if (!users.length) {
      return;
    }

    const upsertPayload = users.map(user => {
      const isActive = user.email_confirmed_at !== null;
      const isAdmin =
        user.app_metadata?.role === 'admin' ||
        user.user_metadata?.role === 'admin';

      return {
        id: user.id,
        email: user.email,
        passwordHash: null,
        fullName: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
        avatarUrl: user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? null,
        phone: user.user_metadata?.phone ?? null,
        address: user.user_metadata?.address ?? null,
        bio: user.user_metadata?.bio ?? null,
        role: isAdmin ? UserRole.ADMIN : UserRole.USER,
        status: isActive ? UserStatus.ACTIVE : UserStatus.INACTIVE,
        emailConfirmedAt: user.email_confirmed_at ? new Date(user.email_confirmed_at) : null,
        lastSignInAt: user.last_sign_in_at ? new Date(user.last_sign_in_at) : null,
        appMetadata: user.app_metadata || null,
        userMetadata: user.user_metadata || null,
      };
    });

    await this.userModel.bulkCreate(upsertPayload, {
      updateOnDuplicate: [
        'email',
        'fullName',
        'avatarUrl',
        'phone',
        'address',
        'bio',
        'role',
        'status',
        'emailConfirmedAt',
        'lastSignInAt',
        'appMetadata',
        'userMetadata',
        'updatedAt',
      ],
    });
  }

  private async fetchSupabaseUserById(id: string) {
    const { data, error } = await this.supabaseAdmin.auth.admin.getUserById(id);

    if (error) {
      this.logger.error(`Failed to fetch Supabase user with id ${id}`, error.message);
      return null;
    }

    return data?.user ?? null;
  }
}
