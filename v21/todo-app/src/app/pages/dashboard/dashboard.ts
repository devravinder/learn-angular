import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { KanbanColumn } from '../../components/kanban-column/kanban-column';
import { Modal } from '../../components/modal/modal';
import { TaskForm } from '../../components/task-form/task-form';
import { TaskService } from '../../services/tasks/task.service';
import { sortDsc } from '../../util/common';

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
  showModal = signal<boolean>(false);

  task = signal<Task | null>(null);

  groups = computed(() => {
    const ARCHIVE = this.taskService.config()['Workflow Statuses']['ARCHIVE_STATUS'];
    return this.taskService.config().Statuses.filter((status) => status != ARCHIVE);
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
}

export default Dashboard;
