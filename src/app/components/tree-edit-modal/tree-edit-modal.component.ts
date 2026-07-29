import { Component, input, output, signal, computed, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe';
import { fruitBadgeSvg } from '../../icons/fruit-icons';
import { FRUIT_TYPES, TREE_SIZES, FruitType, TreeSize, TreeData } from '../../models/tree';

@Component({
  selector: 'app-tree-edit-modal',
  standalone: true,
  imports: [FormsModule, SafeHtmlPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="backdrop">
      <div class="modal" (click)="$event.stopPropagation()">
        <h2>{{ isNew() ? 'Plant a Tree' : 'Edit Tree' }}</h2>

        <div class="field">
          <label>Name</label>
          <input type="text" placeholder="e.g. Old Oak" [(ngModel)]="name" name="name" />
        </div>

        <div class="field">
          <label>Age (years)</label>
          <input type="number" min="0" max="200" [(ngModel)]="age" name="age" />
        </div>

        <div class="field">
          <label>Size</label>
          <div class="size-picker">
            @for (s of sizes; track s) {
              <div class="size-option" [class.selected]="size() === s" (click)="setSize(s)">{{ s }}</div>
            }
          </div>
        </div>

        <div class="field">
          <label>Fruit</label>
          <div class="fruit-picker">
            @for (f of fruits; track f) {
              <div class="fruit-option" [class.selected]="fruit() === f" (click)="fruit.set(f)">
                <span [innerHTML]="fruitSvg(f) | safeHtml"></span>
                <span>{{ f }}</span>
              </div>
            }
          </div>
        </div>

        <div class="field">
          <label>Notes</label>
          <textarea [(ngModel)]="notes" name="notes" rows="2"></textarea>
        </div>

        <div class="actions">
          <button class="btn-cancel" (click)="cancelEdit.emit()">Cancel</button>
          <button class="btn-save" (click)="save()">{{ isNew() ? 'Plant' : 'Save' }}</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .backdrop {
      position: fixed; inset: 0; z-index: 100;
      background: rgba(0,0,0,0.2);
      display: flex; align-items: center; justify-content: center;
    }
    .modal {
      background: var(--pt-surface, #fff);
      border: 1px solid var(--pt-border, #ddd);
      padding: 24px 28px;
      box-shadow: 0 4px 16px var(--pt-shadow, rgba(0,0,0,0.08));
      min-width: 340px; max-width: 420px; width: 90vw;
    }
    h2 { margin: 0 0 18px; font-size: 1.1rem; color: var(--pt-text, #333); font-weight: 600; }
    .field { margin-bottom: 14px; }
    label {
      display: block; font-size: 0.75rem; color: var(--pt-text-muted, #888);
      font-weight: 600; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.03em;
    }
    input, textarea {
      width: 100%; padding: 7px 10px;
      border: 1px solid var(--pt-border, #ccc);
      font-size: 0.9rem; font-family: inherit;
      background: var(--pt-bg, #fff); color: var(--pt-text, #333);
      outline: none; transition: border-color 0.15s;
      box-sizing: border-box;
    }
    input:focus, textarea:focus { border-color: var(--pt-accent, #666); }
    textarea { resize: vertical; min-height: 50px; }
    .fruit-picker { display: flex; flex-wrap: wrap; gap: 4px; }
    .fruit-option {
      display: flex; flex-direction: column; align-items: center; gap: 2px;
      padding: 5px 7px; border: 1px solid transparent;
      background: var(--pt-bg-alt, #f5f5f5); cursor: pointer;
      font-size: 0.65rem; color: var(--pt-text-muted, #888);
      transition: border-color 0.15s, background 0.15s;
    }
    .fruit-option:hover { background: var(--pt-surface-alt, #eee); }
    .fruit-option.selected { border-color: var(--pt-accent, #555); background: var(--pt-surface-alt, #eee); color: var(--pt-text, #333); }
    .size-picker { display: flex; gap: 4px; }
    .size-option {
      padding: 5px 14px; border: 1px solid transparent;
      background: var(--pt-bg-alt, #f5f5f5); cursor: pointer;
      font-size: 0.8rem; font-weight: 600; color: var(--pt-text-muted, #888);
      transition: border-color 0.15s, background 0.15s;
    }
    .size-option:hover { background: var(--pt-surface-alt, #eee); }
    .size-option.selected { border-color: var(--pt-accent, #555); background: var(--pt-surface-alt, #eee); color: var(--pt-text, #333); }
    .actions { display: flex; gap: 8px; margin-top: 18px; }
    button { border: none; padding: 8px 20px; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: opacity 0.15s; }
    button:hover { opacity: 0.85; }
    .btn-save { flex: 1; background: var(--pt-accent, #555); color: var(--pt-accent-fg, #fff); }
    .btn-cancel { background: var(--pt-bg-alt, #eee); color: var(--pt-text-muted, #666); }
  `],
})
export class TreeEditModalComponent implements OnInit {
  tree = input.required<TreeData>();
  saveTree = output<TreeData>();
  cancelEdit = output<void>();

  readonly fruits = FRUIT_TYPES;
  readonly sizes = TREE_SIZES;
  readonly fruitSvg = fruitBadgeSvg;

  name = signal('');
  age = signal(0);
  size = signal<TreeSize>('normal');
  fruit = signal<FruitType>('apple');
  notes = signal('');

  isNew = computed(() => this.tree().state !== 'active');

  ngOnInit() {
    const t = this.tree();
    this.name.set(t.name);
    this.age.set(t.age);
    this.size.set(t.size ?? 'normal');
    this.fruit.set(t.fruit);
    this.notes.set(t.notes);
  }

  setSize(s: TreeSize) {
    this.size.set(s);
    const defaults: Record<TreeSize, number> = { small: 3, normal: 10, big: 25 };
    this.age.set(defaults[s]);
  }

  save() {
    this.saveTree.emit({
      ...this.tree(),
      state: 'active',
      name: this.name(),
      age: this.age(),
      size: this.size(),
      fruit: this.fruit(),
      notes: this.notes(),
    });
  }
}
