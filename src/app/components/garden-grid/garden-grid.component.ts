import {
  Component, signal, computed, inject, OnInit, ChangeDetectionStrategy,
} from '@angular/core';
import { Router } from '@angular/router';
import { MobileService } from '@pure-tools/mobilka';
import { ThemeService, BUILT_IN_THEMES } from '@pure-tools/paletka';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { GardenState, TreeData, createGarden } from '../../models/tree';
import { TreeCellComponent } from '../tree-cell/tree-cell.component';
import { TreeEditModalComponent } from '../tree-edit-modal/tree-edit-modal.component';
import { SetupDialogComponent } from '../setup-dialog/setup-dialog.component';

@Component({
  selector: 'app-garden-grid',
  standalone: true,
  imports: [TreeCellComponent, TreeEditModalComponent, SetupDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading()) {
      <div class="loading">Loading your garden…</div>
    } @else if (showSetup()) {
      <app-setup-dialog (gardenCreated)="onGardenCreated($event)" />
    } @else {
      <div class="page">
        <header class="header">
          <h1>🌳 My Garden</h1>
          <div class="header-actions">
            <div class="theme-picker">
              @for (theme of themes; track theme.name) {
                <button
                  class="theme-dot"
                  [title]="theme.name"
                  [style.background]="theme.vars['--pt-accent']"
                  [class.active]="currentTheme() === theme.name"
                  (click)="setTheme(theme.name)">
                </button>
              }
            </div>
            <button class="btn-secondary" (click)="newGarden()">New Garden</button>
            <button class="btn-secondary" (click)="signOut()">Sign out</button>
          </div>
        </header>

        <div class="grid-scroll">
          <div class="grid" [style.grid-template-columns]="gridCols()">
            @for (tree of garden()!.trees; track tree.id) {
              <app-tree-cell
                [tree]="tree"
                (cellClick)="onCellClick(tree)"
                (editRequested)="editTarget.set($event)"
                (deleteRequested)="deleteTree($event)"
              />
            }
          </div>
        </div>
      </div>
    }

    @if (editTarget()) {
      <app-tree-edit-modal
        [tree]="getTree(editTarget()!)!"
        (saveTree)="onSave($event)"
        (cancelEdit)="editTarget.set(null)"
      />
    }
  `,
  styles: [`
    .loading {
      display: flex; align-items: center; justify-content: center;
      min-height: 100vh; color: var(--pt-text-muted, #888); font-size: 0.95rem;
    }
    .page { min-height: 100vh; background: var(--pt-bg, #fafafa); }
    .header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 16px 24px;
      border-bottom: 1px solid var(--pt-border, #eee);
      background: var(--pt-surface, #fff);
      gap: 12px; flex-wrap: wrap;
    }
    h1 { margin: 0; font-size: 1.1rem; color: var(--pt-text, #333); font-weight: 700; }
    .header-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .theme-picker { display: flex; gap: 4px; align-items: center; }
    .theme-dot {
      width: 16px; height: 16px; border-radius: 50%;
      border: 2px solid transparent; cursor: pointer; padding: 0;
      transition: transform 0.15s, border-color 0.15s;
    }
    .theme-dot:hover { transform: scale(1.2); }
    .theme-dot.active { border-color: var(--pt-text, #333); }
    .btn-secondary {
      padding: 5px 12px;
      background: var(--pt-bg-alt, #eee);
      color: var(--pt-text-muted, #666);
      border: 1px solid var(--pt-border, #ddd);
      font-size: 0.8rem; font-weight: 600; cursor: pointer;
      transition: background 0.15s;
    }
    .btn-secondary:hover { background: var(--pt-surface-alt, #ddd); }
    .grid-scroll { overflow-x: auto; padding: 24px; }
    .grid {
      display: grid;
      gap: clamp(6px, 1.2vw, 16px);
      margin: 0 auto;
      width: max-content;
      min-width: min(100%, 900px);
    }
  `],
})
export class GardenGridComponent implements OnInit {
  private auth = inject(AuthService);
  private storage = inject(StorageService);
  private mobile = inject(MobileService);
  private themeService = inject(ThemeService);
  private router = inject(Router);

  garden = signal<GardenState | null>(null);
  editTarget = signal<string | null>(null);
  loading = signal(true);

  showSetup = computed(() => this.garden() === null && !this.loading());
  currentTheme = computed(() => this.themeService.theme()?.name ?? null);
  themes = BUILT_IN_THEMES;

  gridCols = computed(() => {
    const cols = this.garden()?.cols ?? 6;
    const size = this.mobile.isMobile()
      ? 'minmax(50px, 70px)'
      : this.mobile.isTablet()
        ? 'minmax(60px, 85px)'
        : 'minmax(60px, 90px)';
    return `repeat(${cols}, ${size})`;
  });

  async ngOnInit() {
    const user = this.auth.user();
    if (!user) { this.router.navigate(['/login']); return; }
    const state = await this.storage.load(user.id);
    this.garden.set(state);
    this.loading.set(false);
  }

  getTree(id: string): TreeData | undefined {
    return this.garden()?.trees.find(t => t.id === id);
  }

  onCellClick(tree: TreeData) {
    if (tree.state === 'empty' || tree.state === 'deleted') {
      this.editTarget.set(tree.id);
    }
  }

  onSave(updated: TreeData) {
    this.updateGarden(g => ({
      ...g,
      trees: g.trees.map(t => t.id === updated.id ? updated : t),
    }));
    this.editTarget.set(null);
  }

  deleteTree(id: string) {
    this.updateGarden(g => ({
      ...g,
      trees: g.trees.map(t => t.id === id ? { ...t, state: 'deleted' as const, name: '', age: 0, notes: '' } : t),
    }));
  }

  onGardenCreated(size: { rows: number; cols: number }) {
    const state = createGarden(size.rows, size.cols);
    this.garden.set(state);
    this.persist(state);
  }

  newGarden() {
    this.garden.set(null);
  }

  setTheme(name: string) {
    this.themeService.setTheme(name);
  }

  async signOut() {
    await this.auth.signOut();
    this.router.navigate(['/login']);
  }

  private updateGarden(fn: (g: GardenState) => GardenState) {
    const current = this.garden();
    if (!current) return;
    const updated = fn(current);
    this.garden.set(updated);
    this.persist(updated);
  }

  private async persist(state: GardenState) {
    const user = this.auth.user();
    if (user) await this.storage.save(user.id, state);
  }
}
