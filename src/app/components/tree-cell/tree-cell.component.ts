import { Component, input, output, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe';
import { TreeData, getAgeCategory } from '../../models/tree';
import { treeIconSvg } from '../../icons/tree-icons';
import { fruitBadgeSvg } from '../../icons/fruit-icons';
import { ghostTreeIconSvg } from '../../icons/ghost-tree-icon';

@Component({
  selector: 'app-tree-cell',
  standalone: true,
  imports: [SafeHtmlPipe, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="cell" [class]="'cell--' + tree().state"
         (click)="onClick()" (mouseleave)="confirmingDelete.set(false)">

      @if (tree().state === 'empty') {
        <span class="ghost" [innerHTML]="ghostIcon | safeHtml"></span>
        <div class="actions">
          <ng-container *ngTemplateOutlet="deleteBtn" />
        </div>
      }

      @if (tree().state === 'deleted') {
        <span class="ghost-hover" [innerHTML]="ghostIcon | safeHtml"></span>
      }

      @if (tree().state === 'active') {
        <div class="tree-wrap">
          <span [innerHTML]="treeHtml() | safeHtml"></span>
          <span class="fruit-badge" [innerHTML]="fruitHtml() | safeHtml"></span>
        </div>
        <div class="tree-label">
          @if (tree().name) { <div class="tree-label-name">{{ tree().name }}</div> }
          <div class="tree-label-age">{{ tree().age }} yr</div>
        </div>
        <div class="actions">
          <button class="action-btn" (click)="onEdit($event)" title="Edit">
            <svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11.5 1.5l3 3L5 14H2v-3L11.5 1.5z"/>
            </svg>
          </button>
          <ng-container *ngTemplateOutlet="deleteBtn" />
        </div>
      }
    </div>

    <ng-template #deleteBtn>
      @if (confirmingDelete()) {
        <button class="action-btn action-btn--confirm" (click)="onConfirmDelete($event)" title="Confirm">
          <svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="#D32F2F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3,8 7,12 13,4"/>
          </svg>
        </button>
      } @else {
        <button class="action-btn" (click)="onDelete($event)" title="Delete">
          <svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="3" x2="13" y2="13"/><line x1="13" y1="3" x2="3" y2="13"/>
          </svg>
        </button>
      }
    </ng-template>
  `,
  styles: [`
    :host { display: block; position: relative; }
    .cell {
      display: flex; align-items: center; justify-content: center;
      border-radius: 12px; background: transparent; cursor: pointer;
      transition: transform 0.15s ease; position: relative; aspect-ratio: 1;
      overflow: visible;
    }
    .cell:hover { transform: scale(1.05); }
    .tree-wrap { position: relative; display: flex; align-items: center; justify-content: center; }
    .fruit-badge { position: absolute; bottom: 4px; right: 2px; }
    .actions { position: absolute; top: 2px; right: 2px; display: none; gap: 2px; }
    .cell:hover .actions { display: flex; }
    .action-btn {
      width: 14px; height: 14px; display: flex; align-items: center; justify-content: center;
      background: transparent; border: none; cursor: pointer; padding: 0;
      opacity: 0.4; transition: opacity 0.15s; color: var(--pt-text, #333);
    }
    .action-btn:hover { opacity: 1; }
    .action-btn--confirm { opacity: 0.8; }
    .tree-label {
      position: absolute; bottom: -2px; left: -4px; right: -4px;
      text-align: center; font-size: 0.65rem; color: var(--pt-text-muted, #555);
      display: none; line-height: 1.3; pointer-events: none;
    }
    .tree-label-name { font-weight: 600; color: var(--pt-text, #333); }
    .tree-label-age { color: var(--pt-text-muted, #888); }
    .cell:hover .tree-label { display: block; }
    .ghost-hover { display: none; }
    .cell:hover .ghost-hover { display: block; }
  `],
})
export class TreeCellComponent {
  tree = input.required<TreeData>();
  cellClick = output<string>();
  editRequested = output<string>();
  deleteRequested = output<string>();

  confirmingDelete = signal(false);

  readonly ghostIcon = ghostTreeIconSvg();
  treeHtml = computed(() => treeIconSvg(getAgeCategory(this.tree().age), this.tree().size));
  fruitHtml = computed(() => fruitBadgeSvg(this.tree().fruit));

  onClick() {
    this.cellClick.emit(this.tree().id);
  }

  onEdit(e: Event) {
    e.stopPropagation();
    this.editRequested.emit(this.tree().id);
  }

  onDelete(e: Event) {
    e.stopPropagation();
    this.confirmingDelete.set(true);
  }

  onConfirmDelete(e: Event) {
    e.stopPropagation();
    this.confirmingDelete.set(false);
    this.deleteRequested.emit(this.tree().id);
  }
}
