import { Injectable, inject, signal, computed } from '@angular/core';
import type { User } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private sb = inject(SupabaseService);

  private _user = signal<User | null>(null);
  private _loading = signal(true);

  readonly user = this._user.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);

  constructor() {
    if (!this.sb.isConfigured) { this._loading.set(false); return; }
    const client = this.sb.client;
    client.auth.getSession().then(({ data }) => {
      this._user.set(data.session?.user ?? null);
      this._loading.set(false);
    });
    client.auth.onAuthStateChange((_, session) => {
      this._user.set(session?.user ?? null);
    });
  }

  async signIn(email: string): Promise<void> {
    await this.sb.client.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/garden` },
    });
  }

  async signOut(): Promise<void> {
    await this.sb.client.auth.signOut();
  }

  async getAccessToken(): Promise<string | null> {
    const { data } = await this.sb.client.auth.getSession();
    return data.session?.access_token ?? null;
  }

  async refreshUser(): Promise<void> {
    const { data } = await this.sb.client.auth.getUser();
    this._user.set(data.user ?? null);
  }
}
