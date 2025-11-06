import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class UsersService {
  private supabaseAdmin;

  constructor() {
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

  async getAllUsers(filters: { search?: string; status?: string; role?: string }) {
    try {
      let query = this.supabaseAdmin.auth.admin.listUsers();
      
      // Apply search filter if provided
      if (filters.search) {
        query = query.or(`email.ilike.%${filters.search}%,raw_user_meta_data->full_name.ilike.%${filters.search}%`);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw new Error(`Failed to fetch users: ${error.message}`);
      }
      
      let users = data?.users || [];
      
      // Apply client-side filters
      if (filters.status) {
        users = users.filter(user => {
          const isActive = user.email_confirmed_at !== null;
          return filters.status === 'active' ? isActive : !isActive;
        });
      }
      
      if (filters.role) {
        users = users.filter(user => {
          const isAdmin = user.app_metadata?.role === 'admin';
          return filters.role === 'admin' ? isAdmin : !isAdmin;
        });
      }
      
      return {
        users: users.map(user => ({
          id: user.id,
          email: user.email,
          email_confirmed_at: user.email_confirmed_at,
          created_at: user.created_at,
          last_sign_in_at: user.last_sign_in_at,
          user_metadata: user.user_metadata,
          app_metadata: user.app_metadata,
        })),
        total: users.length
      };
    } catch (error) {
      throw new Error(`Error fetching users: ${error.message}`);
    }
  }
}
