import { Component, computed, effect, inject } from '@angular/core';
import { KanbanColumn } from '../../components/kanban-column/kanban-column';
import { ConfigService } from '../../services/config/config.service';
import { TaskService } from '../../services/tasks/task.service';

@Component({
  selector: 'app-dashboard',
  imports: [KanbanColumn],
  template: `
    @for (group of groups(); track group) {
      <app-kanban-column [title]="group" [tasks]="groupedTasks()[group]" class="flex flex-col h-fit shrink-0 w-80 rounded-lg border border-slate-300" />
    }
  `,
  //:host { display: contents; } -> angular trick: then browser treats like the selector doesn't exists
   styles: [`
    :host { display: contents; }
  `],
})
export class Dashboard {
  taskService = inject(TaskService);

  configService = inject(ConfigService)

  groups = computed(()=> {
   const ARCHIVE = this.configService.config()['Workflow Statuses']["ARCHIVE_STATUS"]
   return this.configService.config().Statuses.filter(status=> status != ARCHIVE)

  })

  groupedTasks = computed(() =>
    this.taskService.tasks().reduce(
      (pre, cur) => {
        if (!pre[cur.Status]) {
          pre[cur.Status] = [];
        }

        pre[cur.Status].push(cur);

        return pre;
      },
      {} as Record<string, Task[]>,
    ),
  );

  constructor() {
    effect(() => {
      console.log('Grouped tasks:', this.groupedTasks());
    });
  }
}
