import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class PurchaseService {
  private auth = inject(AuthService);
  private supabase = inject(SupabaseService).client;

  async hasPurchased(): Promise<boolean> {
    const { data } = await this.supabase.auth.getUser();
    return data.user?.user_metadata?.['purchased'] === true;
  }

  async completePurchase(orderId: string): Promise<boolean> {
    const token = await this.auth.getAccessToken();
    if (!token) return false;
    try {
      const res = await fetch('/api/complete-purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId }),
      });
      if (!res.ok) return false;
      await this.auth.refreshUser();
      return true;
    } catch {
      return false;
    }
  }
}
