import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  readonly isConfigured = !!(environment.supabaseUrl && environment.supabaseAnonKey);

  private _client: SupabaseClient | null = this.isConfigured
    ? createClient(environment.supabaseUrl, environment.supabaseAnonKey)
    : null;

  get client(): SupabaseClient {
    if (!this._client) throw new Error('Supabase is not configured.');
    return this._client;
  }
}
