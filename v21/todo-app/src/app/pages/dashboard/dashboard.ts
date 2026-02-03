import { Component, computed, effect, inject, signal } from '@angular/core';
import { KanbanColumn } from '../../components/kanban-column/kanban-column';
import { Modal } from '../../components/modal/modal';
import { TaskForm } from '../../components/task-form/task-form';
import { ConfigService } from '../../services/config/config.service';
import { TaskService } from '../../services/tasks/task.service';
import { sortDsc } from '../../util/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [KanbanColumn, Modal, TaskForm, RouterOutlet],
  template: `
    @for (group of groups(); track group) {
      <app-kanban-column
        [title]="group"
        [tasks]="groupedTasks()[group]"
        (onAddClick)="onAddClick($event)"
        class="flex flex-col h-fit shrink-0 w-80 rounded-lg border border-border"
      />
    }
    @if (showModal()) {
      <app-modal
        [isOpen]="showModal()"
        (onClose)="toggleModal()"
        title="Create Task"
        class="absolute"
      >
        <app-task-form [data]="task()!" (onCancel)="toggleModal()" (onSubmit)="onSubmit($event)" />
      </app-modal>
    }
    <router-outlet />
  `,
  //:host { display: contents; } -> angular trick: then browser treats like the selector doesn't exists
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export class Dashboard {
  taskService = inject(TaskService);

  configService = inject(ConfigService);

  showModal = signal<boolean>(false);

  task = signal<Task | null>(null);

  groups = computed(() => {
    const ARCHIVE = this.configService.config()['Workflow Statuses']['ARCHIVE_STATUS'];
    return this.configService.config().Statuses.filter((status) => status != ARCHIVE);
  });

  tasks = computed(() => this.taskService.tasks());

  groupedTasks = computed(() =>
    this.tasks()
      .sort(sortDsc)
      .reduce(
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

  toggleModal() {
    this.showModal.set(!this.showModal());
  }

  onSubmit(task: Task) {
    this.taskService.addTask(task);
    this.toggleModal();
  }

  onAddClick(status: string) {
    this.task.set(this.taskService.getSampleNewTask(status));
    this.toggleModal();
  }

  constructor() {
    effect(() => {
      console.log({ tasks: this.tasks(), 'Grouped tasks:': this.groupedTasks() });
    });
  }
}

export default Dashboard;
