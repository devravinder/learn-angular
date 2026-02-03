import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, ResolveFn, Router } from '@angular/router';
import { ConfigService } from '../../../services/config/config.service';
import { TaskService } from '../../../services/tasks/task.service';
import { Modal } from '../../../components/modal/modal';
import { KanbanColumn } from '../../../components/kanban-column/kanban-column';
import { toSignal } from '@angular/core/rxjs-interop';

export const archiveTasksResolver: ResolveFn<{ tasks: Task[]; status: string }> = () => {
  const configService = inject(ConfigService);
  const taskService = inject(TaskService);
  const status = configService.config()['Workflow Statuses']['ARCHIVE_STATUS'];
  return { tasks: taskService.getTasksByStatus(status), status };
};

@Component({
  selector: 'app-archive',
  imports: [Modal, KanbanColumn],
  template: `
    <app-modal [isOpen]="true" (onClose)="goToParent()" class="absolute">
      <app-kanban-column
        [title]="archiveData().status"
        [tasks]="archiveData().tasks"
        class="flex flex-col h-fit min-h-[80vh] shrink-0 w-80 rounded-lg border border-border"
      />
    </app-modal>
  `,
  styles: ``,
})
export class Archive {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  data = toSignal(this.route.data);
  archiveData = computed(() => this.data()!['data'] as { tasks: Task[]; status: string });
  goToParent() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}

export default Archive;
