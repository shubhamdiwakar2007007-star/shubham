import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables or localStorage configuration for live browser testing
const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

// Allow local overrides saved via Settings UI
const savedUrl = typeof window !== 'undefined' ? localStorage.getItem('tastehub_supabase_url') || '' : '';
const savedKey = typeof window !== 'undefined' ? localStorage.getItem('tastehub_supabase_key') || '' : '';

export const SUPABASE_URL = savedUrl || envUrl;
export const SUPABASE_ANON_KEY = savedKey || envKey;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    SUPABASE_URL.startsWith('http') &&
    !SUPABASE_URL.includes('your-project-ref') &&
    !SUPABASE_ANON_KEY.includes('your-anon-public-key')
  );
};

// Safe fallback client to prevent build / runtime crashes when keys are not yet input
const placeholderUrl = 'https://placeholder.supabase.co';
const placeholderKey = 'placeholder-key';

export const supabase: SupabaseClient = createClient(
  isSupabaseConfigured() ? SUPABASE_URL : placeholderUrl,
  isSupabaseConfigured() ? SUPABASE_ANON_KEY : placeholderKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);

// Connection test and diagnostics helper
export async function testSupabaseConnection(): Promise<{
  configured: boolean;
  connected: boolean;
  message: string;
  details?: any;
}> {
  if (!isSupabaseConfigured()) {
    return {
      configured: false,
      connected: false,
      message: 'Supabase credentials not configured in environment or settings.'
    };
  }

  try {
    const { data, error } = await supabase.from('categories').select('count', { count: 'exact', head: true });
    if (error) {
      // If table doesn't exist yet, but request reached Supabase
      if (error.code === '42P01') {
        return {
          configured: true,
          connected: true,
          message: 'Connected to Supabase! The database schema (supabase_schema.sql) needs to be run in the SQL editor.'
        };
      }
      return {
        configured: true,
        connected: false,
        message: `Connected with error: ${error.message} (Code: ${error.code})`
      };
    }
    return {
      configured: true,
      connected: true,
      message: 'Successfully connected to Supabase database!'
    };
  } catch (err: any) {
    return {
      configured: true,
      connected: false,
      message: `Failed to connect: ${err.message || 'Network error'}`
    };
  }
}

// Storage Helper: Upload dish or general media to Supabase Storage
export async function uploadDishImage(file: File): Promise<{ url: string | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    // Return a local object URL for offline/sandbox development
    const localUrl = URL.createObjectURL(file);
    return { url: localUrl, error: null };
  }

  try {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `dishes/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('dish-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Supabase storage upload error:', uploadError);
      return { url: null, error: uploadError.message };
    }

    const { data } = supabase.storage
      .from('dish-images')
      .getPublicUrl(filePath);

    return { url: data.publicUrl, error: null };
  } catch (err: any) {
    return { url: null, error: err.message || 'Image upload failed' };
  }
}
