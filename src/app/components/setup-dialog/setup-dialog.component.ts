import { Component, signal, output, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-setup-dialog',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="backdrop" (click)="$event.stopPropagation()">
      <div class="dialog">
        <h2>Plant Your Garden</h2>
        <p>Choose the size of your garden grid</p>
        <div class="fields">
          <div class="field">
            <label>Rows</label>
            <input type="number" min="1" max="12" [(ngModel)]="rows" name="rows" />
          </div>
          <div class="field">
            <label>Columns</label>
            <input type="number" min="1" max="12" [(ngModel)]="cols" name="cols" />
          </div>
        </div>
        <button (click)="create()">Create Garden</button>
      </div>
    </div>
  `,
  styles: [`
    .backdrop {
      position: fixed; inset: 0; z-index: 100;
      background: rgba(0,0,0,0.3);
      display: flex; align-items: center; justify-content: center;
    }
    .dialog {
      background: var(--pt-surface, #fff);
      border: 1px solid var(--pt-border, #ddd);
      padding: 28px 32px;
      box-shadow: 0 4px 20px var(--pt-shadow, rgba(0,0,0,0.1));
      min-width: 280px;
    }
    h2 { margin: 0 0 4px; font-size: 1.1rem; color: var(--pt-text, #333); font-weight: 600; }
    p { margin: 0 0 20px; color: var(--pt-text-muted, #888); font-size: 0.85rem; }
    .fields { display: flex; gap: 12px; margin-bottom: 20px; }
    .field { display: flex; flex-direction: column; gap: 4px; flex: 1; }
    label { font-size: 0.72rem; color: var(--pt-text-muted, #888); font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; }
    input {
      padding: 8px 10px;
      border: 1px solid var(--pt-border, #ccc);
      font-size: 0.95rem;
      background: var(--pt-bg, #fff);
      color: var(--pt-text, #333);
      outline: none;
    }
    input:focus { border-color: var(--pt-accent, #555); }
    button {
      width: 100%; padding: 10px;
      background: var(--pt-accent, #555);
      color: var(--pt-accent-fg, #fff);
      border: none; font-size: 0.9rem; font-weight: 600;
      cursor: pointer; transition: opacity 0.15s;
    }
    button:hover { opacity: 0.85; }
  `],
})
export class SetupDialogComponent {
  gardenCreated = output<{ rows: number; cols: number }>();

  rows = signal(4);
  cols = signal(6);

  create() {
    const r = Math.max(1, Math.min(12, this.rows()));
    const c = Math.max(1, Math.min(12, this.cols()));
    this.gardenCreated.emit({ rows: r, cols: c });
  }
}
