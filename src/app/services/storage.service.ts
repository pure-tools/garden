import { Injectable, inject } from '@angular/core';
import { GardenState } from '../models/tree';
import { SupabaseService } from './supabase.service';

const BUCKET = 'gardens';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private supabase = inject(SupabaseService).client;

  async load(userId: string): Promise<GardenState | null> {
    const { data, error } = await this.supabase.storage
      .from(BUCKET)
      .download(`${userId}/garden.json`);
    if (error || !data) return null;
    const text = await data.text();
    return JSON.parse(text) as GardenState;
  }

  async save(userId: string, state: GardenState): Promise<void> {
    const blob = new Blob([JSON.stringify(state)], { type: 'application/json' });
    await this.supabase.storage
      .from(BUCKET)
      .upload(`${userId}/garden.json`, blob, { upsert: true });
  }
}
