import { Component, computed, inject } from '@angular/core';
import { Modal } from '../../../components/modal/modal';
import { TaskForm } from '../../../components/task-form/task-form';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  RedirectCommand,
  ResolveFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { TaskService } from '../../../services/tasks/task.service';
import { toSignal } from '@angular/core/rxjs-interop';

export const taskResolver: ResolveFn<Task> = (
  route: ActivatedRouteSnapshot,
  _: RouterStateSnapshot, // state
) => {
  const router = inject(Router);
  const taskService = inject(TaskService);
  const taskId = route.paramMap.get('id')!;
  const task = taskService.getTask(taskId);
  if (task) {
    return task;
  }

  console.log(`task deatils not found id: ${taskId}`);

  const dashBoard = router.parseUrl('');
  return new RedirectCommand(dashBoard, {
    skipLocationChange: false, // skip adding to browser history
  });
};

@Component({
  selector: 'app-task-details',
  imports: [Modal, TaskForm],
  template: `
    <app-modal [isOpen]="true" (onClose)="goToParent()" title="Test" class="absolute">
      <app-task-form [data]="task()" (onCancel)="goToParent()" (onSubmit)="onSubmit($event)" />
    </app-modal>
  `,
  styles: ``,
})
export class TaskDetails {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  taskService = inject(TaskService);

  data = toSignal(this.route.data);
  task = computed(() => this.data()!['task'] as Task);

  // https://angular.dev/guide/routing/read-route-state#route-parameters
  // this.taskId = this.route.snapshot.paramMap.get('id');

  goToParent() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  onSubmit(task: Task) {
    this.taskService.addTask(task);

    this.goToParent();
  }
}

export default TaskDetails;
