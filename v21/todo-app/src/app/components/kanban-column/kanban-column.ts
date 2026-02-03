import { Component, input, output } from '@angular/core';
import { ADD } from '../../util/icons';
import { TaskCard } from '../task-card/task-card';

@Component({
  selector: 'app-kanban-column',
  imports: [TaskCard],
  template: `
    <div
      class="sticky flex items-center justify-between bg-white rounded-t-lg p-4 border-b border-slate-300"
    >
      <div class="flex items-center space-x-2">
        <h2 class="font-semibold text-slate-800">{{ title() }}</h2>
        <span class="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full">
          {{ tasks()?.length }}
        </span>
      </div>
      <button (click)="onAddClick.emit(title())" class="text-slate-400 hover:text-slate-600 cursor-pointer">{{ ADD }}</button>
    </div>

    <div class="grow p-4 space-y-3">
      @for (task of tasks(); track task.Id) {
        <div>
          <app-task-card [task]="task" />
        </div>
      }

      @if (!tasks()?.length) {
        <div class="text-center py-8 text-slate-400">
          <p class="text-sm">No tasks yet</p>
          <button class="text-blue-600 hover:text-blue-700 text-sm mt-1">
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
  onAddClick = output<string>()
}
