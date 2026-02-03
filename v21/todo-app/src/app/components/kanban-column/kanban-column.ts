import { Component, input, output } from '@angular/core';
import { ADD } from '../../util/icons';
import { TaskCard } from '../task-card/task-card';

@Component({
  selector: 'app-kanban-column',
  imports: [TaskCard],
  template: `
    <div
      class="sticky flex items-center justify-between bg-background rounded-t-lg p-4 border-b border-border"
    >
      <div class="flex items-center space-x-2">
        <h2 class="font-semibold text-foreground">{{ title() }}</h2>
        <span class="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
          {{ tasks()?.length || 0 }}
        </span>
      </div>
      @if (onAddClick) {
        <button
          (click)="onAddClick.emit(title())"
          class="text-foreground/40 hover:text-foreground/50 cursor-pointer"
        >
          {{ ADD }}
        </button>
      }
    </div>

    <div class="grow p-4 space-y-3">
      @for (task of tasks(); track task.Id) {
        <div>
          <app-task-card [task]="task" />
        </div>
      }

      @if (!tasks()?.length) {
        <div class="text-center py-8 text-muted-foreground">
          <p class="text-sm">No tasks yet</p>
          <button
            (click)="onAddClick.emit(title())"
            class="text-primary hover:text-primary-dark text-sm mt-1"
          >
            Add your first task
          </button>
        </div>
      }
    </div>
  `,
  styles: ``,
})
export class KanbanColumn {
  tasks = input<Task[]>();
  title = input.required<string>();
  ADD = ADD;
  onAddClick = output<string>();
}
