import { UserProfile, UserAddress } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  salt: string;
  role: 'customer' | 'admin' | 'delivery_partner';
  avatar: string;
  isEmailVerified: boolean;
  createdAt: string;
  addresses: UserAddress[];
  favoriteDishIds: string[];
}

export interface AuthSession {
  token: string;
  userId: string;
  email: string;
  role: 'customer' | 'admin' | 'delivery_partner';
  expiresAt: number;
}

const USERS_STORAGE_KEY = 'tastehub_users_db_v1';
const SESSION_STORAGE_KEY = 'tastehub_auth_session_v1';

// Cryptographic password hashing helper using standard browser SubtleCrypto (SHA-256 with salt)
async function hashPassword(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt + 'tastehub_secure_pepper_2026');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

function generateSalt(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

// Initial seed accounts for local offline/preview mode:
// 1. Customer: rahul.sharma@example.com / Password123!
// 2. Admin: admin@tastehub.com / Admin123!
async function createInitialUsers(): Promise<StoredUser[]> {
  const saltRahul = 'salt_rahul_982341';
  const saltAdmin = 'salt_admin_847129';

  const hashRahul = await hashPassword('Password123!', saltRahul);
  const hashAdmin = await hashPassword('Admin123!', saltAdmin);

  return [
    {
      id: 'usr-demo-1',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      phone: '+91 98765 43210',
      passwordHash: hashRahul,
      salt: saltRahul,
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      isEmailVerified: true,
      createdAt: '2026-01-15T10:00:00.000Z',
      addresses: [
        {
          id: 'addr-1',
          type: 'Home',
          name: 'Rahul Sharma',
          phone: '+91 98765 43210',
          street: 'Flat 402, Royal Palms Residency, Tonk Road',
          landmark: 'Near Gandhi Circle',
          city: 'Jaipur',
          state: 'Rajasthan',
          postalCode: '302015',
          isDefault: true
        },
        {
          id: 'addr-2',
          type: 'Work',
          name: 'Rahul Sharma',
          phone: '+91 98765 43210',
          street: 'Tower B, 6th Floor, Cyber Tech Park, Malviya Nagar',
          landmark: 'Opposite World Trade Park',
          city: 'Jaipur',
          state: 'Rajasthan',
          postalCode: '302017',
          isDefault: false
        }
      ],
      favoriteDishIds: ['dish-1', 'dish-2', 'dish-5']
    },
    {
      id: 'usr-admin-1',
      name: 'TasteHub Administrator',
      email: 'admin@tastehub.com',
      phone: '+91 98980 00000',
      passwordHash: hashAdmin,
      salt: saltAdmin,
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      isEmailVerified: true,
      createdAt: '2026-01-01T00:00:00.000Z',
      addresses: [],
      favoriteDishIds: []
    }
  ];
}

class AuthService {
  private users: StoredUser[] = [];
  private currentUser: UserProfile | null = null;
  private isInitialized = false;
  private initPromise: Promise<void> | null = null;

  constructor() {
    this.initPromise = this.init();
  }

  public async ready(): Promise<void> {
    if (this.initPromise) {
      await this.initPromise;
    }
  }

  private async init(): Promise<void> {
    try {
      const raw = localStorage.getItem(USERS_STORAGE_KEY);
      if (raw) {
        this.users = JSON.parse(raw);
      } else {
        this.users = await createInitialUsers();
        this.persistUsers();
      }
    } catch {
      this.users = await createInitialUsers();
    }

    // If Supabase is active, check active Supabase Auth session
    if (isSupabaseConfigured()) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await this.syncSupabaseProfile(session.user);
        }
      } catch (err) {
        console.warn('Supabase auth session check failed:', err);
      }
    }

    this.isInitialized = true;
  }

  private persistUsers(): void {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(this.users));
    } catch (e) {
      console.error('Failed to persist users to localStorage', e);
    }
  }

  private async syncSupabaseProfile(supabaseUser: any): Promise<UserProfile | null> {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      const userProfile: UserProfile = {
        id: supabaseUser.id,
        name: profile?.name || supabaseUser.user_metadata?.name || supabaseUser.email.split('@')[0],
        email: supabaseUser.email || '',
        phone: profile?.phone || supabaseUser.user_metadata?.phone || '+91 98000 00000',
        role: profile?.role || supabaseUser.user_metadata?.role || 'customer',
        avatar: profile?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(supabaseUser.email)}&backgroundColor=FF7518`,
        addresses: profile?.addresses || [],
        favoriteDishIds: profile?.favorite_dish_ids || []
      };

      this.currentUser = userProfile;
      return userProfile;
    } catch (err) {
      console.error('Error syncing Supabase user profile:', err);
      return null;
    }
  }

  // Get current session and user profile
  public getCurrentUser(): UserProfile | null {
    if (this.currentUser) return this.currentUser;

    try {
      const sessionRaw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!sessionRaw) return null;

      const session: AuthSession = JSON.parse(sessionRaw);
      if (Date.now() > session.expiresAt) {
        // Session expired
        this.logout();
        return null;
      }

      const found = this.users.find((u) => u.id === session.userId);
      if (!found) {
        this.logout();
        return null;
      }

      return this.toUserProfile(found);
    } catch {
      return null;
    }
  }

  // Register a new customer or admin
  public async register(params: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role?: 'customer' | 'admin';
  }): Promise<{ success: boolean; user?: UserProfile; message?: string }> {
    await this.ready();

    const cleanEmail = params.email.trim().toLowerCase();
    const cleanName = params.name.trim();

    // 1. Validation checks
    if (!cleanName || cleanName.length < 2) {
      return { success: false, message: 'Please provide a valid full name (at least 2 characters).' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return { success: false, message: 'Please enter a valid email address format (e.g. user@example.com).' };
    }

    // Password strength: min 8 characters, at least one letter and one number
    if (params.password.length < 8) {
      return { success: false, message: 'Password must be at least 8 characters long.' };
    }
    if (!/[A-Za-z]/.test(params.password) || !/[0-9]/.test(params.password)) {
      return { success: false, message: 'Password must contain at least one letter and one number.' };
    }

    // If Supabase is configured, use Supabase Auth
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: params.password,
          options: {
            data: {
              name: cleanName,
              phone: params.phone?.trim() || '+91 98000 00000',
              role: params.role || 'customer'
            }
          }
        });

        if (error) {
          return {
            success: false,
            message: error.message || 'Supabase signup failed. Please try again.'
          };
        }

        if (data.user) {
          // If Supabase has email confirmation enabled
          if (data.session) {
            const synced = await this.syncSupabaseProfile(data.user);
            return {
              success: true,
              user: synced || undefined,
              message: 'Account created successfully in Supabase! Welcome to TasteHub.'
            };
          } else {
            return {
              success: true,
              message: 'Account created! Please check your email to confirm your registration before signing in.'
            };
          }
        }
      } catch (sbErr: any) {
        console.error('Supabase registration error:', sbErr);
        return {
          success: false,
          message: sbErr.message || 'Unable to register user via Supabase.'
        };
      }
    }

    // Fallback Local Auth Mode
    const existing = this.users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return {
        success: false,
        message: 'An account with this email address already exists. Please sign in instead.'
      };
    }

    const salt = generateSalt();
    const passwordHash = await hashPassword(params.password, salt);

    const newUser: StoredUser = {
      id: 'usr-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      name: cleanName,
      email: cleanEmail,
      phone: params.phone?.trim() || '+91 98000 00000',
      passwordHash,
      salt,
      role: params.role || 'customer',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}&backgroundColor=FF7518`,
      isEmailVerified: true,
      createdAt: new Date().toISOString(),
      addresses: [
        {
          id: 'addr-' + Date.now(),
          type: 'Home',
          name: cleanName,
          phone: params.phone?.trim() || '+91 98000 00000',
          street: 'Main City Road',
          city: 'Jaipur',
          state: 'Rajasthan',
          postalCode: '302001',
          isDefault: true
        }
      ],
      favoriteDishIds: []
    };

    this.users.push(newUser);
    this.persistUsers();

    this.createSession(newUser);
    const profile = this.toUserProfile(newUser);
    this.currentUser = profile;

    return {
      success: true,
      user: profile,
      message: 'Account created successfully! Welcome to TasteHub.'
    };
  }

  // Login existing user
  public async login(
    email: string,
    password: string
  ): Promise<{ success: boolean; user?: UserProfile; message?: string }> {
    await this.ready();

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      return { success: false, message: 'Please enter both email address and password.' };
    }

    // If Supabase is configured, sign in with Supabase Auth
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password
        });

        if (error) {
          return {
            success: false,
            message: error.message === 'Invalid login credentials'
              ? 'Invalid email or password. Please verify your credentials.'
              : error.message
          };
        }

        if (data.user) {
          const profile = await this.syncSupabaseProfile(data.user);
          return {
            success: true,
            user: profile || undefined,
            message: `Welcome back, ${profile?.name || 'Customer'}!`
          };
        }
      } catch (sbErr: any) {
        console.error('Supabase signin error:', sbErr);
        return {
          success: false,
          message: sbErr.message || 'Authentication failed via Supabase.'
        };
      }
    }

    // Fallback Local Auth Mode
    const found = this.users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!found) {
      return {
        success: false,
        message: 'No TasteHub account found with this email. Please check your spelling or sign up.'
      };
    }

    // Verify hash
    const computedHash = await hashPassword(password, found.salt);
    if (computedHash !== found.passwordHash) {
      return {
        success: false,
        message: 'Incorrect password. Please verify your credentials or reset your password.'
      };
    }

    // Create session
    this.createSession(found);
    const profile = this.toUserProfile(found);
    this.currentUser = profile;

    return {
      success: true,
      user: profile,
      message: `Welcome back, ${found.name}!`
    };
  }

  // Logout
  public logout(): void {
    if (isSupabaseConfigured()) {
      supabase.auth.signOut().catch((e) => console.warn('Supabase signOut notice:', e));
    }
    this.currentUser = null;
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }

  // Update profile
  public async updateProfile(
    userId: string,
    updates: Partial<UserProfile>
  ): Promise<UserProfile | null> {
    if (isSupabaseConfigured()) {
      try {
        const updatePayload: any = {};
        if (updates.name) updatePayload.name = updates.name.trim();
        if (updates.phone) updatePayload.phone = updates.phone.trim();
        if (updates.avatar) updatePayload.avatar = updates.avatar;

        const { error } = await supabase
          .from('profiles')
          .update(updatePayload)
          .eq('id', userId);

        if (error) console.warn('Supabase profile update warning:', error);
      } catch (err) {
        console.error('Error updating Supabase profile:', err);
      }
    }

    const idx = this.users.findIndex((u) => u.id === userId);
    if (idx !== -1) {
      const current = this.users[idx];
      if (updates.name) current.name = updates.name.trim();
      if (updates.phone) current.phone = updates.phone.trim();
      if (updates.addresses) current.addresses = updates.addresses;
      if (updates.favoriteDishIds) current.favoriteDishIds = updates.favoriteDishIds;
      if (updates.avatar) current.avatar = updates.avatar;
      this.persistUsers();
      this.currentUser = this.toUserProfile(current);
      return this.currentUser;
    }

    if (this.currentUser) {
      this.currentUser = { ...this.currentUser, ...updates };
      return this.currentUser;
    }

    return null;
  }

  // Password reset request
  public async requestPasswordReset(email: string): Promise<{ success: boolean; code?: string; message: string }> {
    await this.ready();
    const cleanEmail = email.trim().toLowerCase();

    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail);
        if (error) {
          return { success: false, message: error.message };
        }
        return {
          success: true,
          message: `Password reset email sent to ${cleanEmail}. Check your inbox for the link.`
        };
      } catch (err: any) {
        return { success: false, message: err.message || 'Failed to send reset email.' };
      }
    }

    const found = this.users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!found) {
      return {
        success: false,
        message: 'No account registered with this email address.'
      };
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    sessionStorage.setItem(`reset_code_${cleanEmail}`, resetCode);

    return {
      success: true,
      code: resetCode,
      message: `A 6-digit password reset code has been sent to ${cleanEmail}.`
    };
  }

  // Reset password with code
  public async resetPassword(
    email: string,
    code: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> {
    await this.ready();
    const cleanEmail = email.trim().toLowerCase();

    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) {
          return { success: false, message: error.message };
        }
        return { success: true, message: 'Password has been updated in Supabase successfully!' };
      } catch (err: any) {
        return { success: false, message: err.message || 'Failed to update password.' };
      }
    }

    const savedCode = sessionStorage.getItem(`reset_code_${cleanEmail}`);
    if (!savedCode || savedCode !== code.trim()) {
      return { success: false, message: 'Invalid or expired reset code. Please request a new code.' };
    }

    if (newPassword.length < 8 || !/[A-Za-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      return { success: false, message: 'New password must be at least 8 characters and contain both letters and numbers.' };
    }

    const found = this.users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!found) {
      return { success: false, message: 'User not found.' };
    }

    const newSalt = generateSalt();
    found.salt = newSalt;
    found.passwordHash = await hashPassword(newPassword, newSalt);
    this.persistUsers();
    sessionStorage.removeItem(`reset_code_${cleanEmail}`);

    return { success: true, message: 'Password has been reset successfully! You can now sign in.' };
  }

  private createSession(user: StoredUser): void {
    const session: AuthSession = {
      token: 'th_sess_' + Math.random().toString(36).substring(2) + Date.now().toString(36),
      userId: user.id,
      email: user.email,
      role: user.role,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days session
    };
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } catch (e) {
      console.error('Failed to save session', e);
    }
  }

  private toUserProfile(user: StoredUser): UserProfile {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
      addresses: user.addresses,
      favoriteDishIds: user.favoriteDishIds
    };
  }
}

export const authService = new AuthService();
