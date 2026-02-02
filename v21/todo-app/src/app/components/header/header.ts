import { Component, computed, inject, signal } from '@angular/core';
import { Button } from '../button/button';
import { ButtonPrimary } from '../button-primary/button-primary';
import { FOLDER, ARCHIVE, SETTINGS, ADD } from '../../util/icons';
import { Router, RouterLink } from '@angular/router';
import { Modal } from '../modal/modal';
import { TaskForm } from '../task-form/task-form';
import { TaskService } from '../../services/tasks/task.service';
@Component({
  selector: 'app-header',
  imports: [Button, ButtonPrimary, RouterLink, Modal, TaskForm],
  template: `
    <div class="max-w-7xl mx-auto flex flex-row items-center justify-between">
      <div (click)="navigateToHome()" class="flex items-center space-x-3 cursor-pointer">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-sm">
            <img src="./favicon.png" />
          </span>
        </div>
        <h1 class="text-xl font-semibold text-slate-800">Todo App</h1>
      </div>

      <div class="flex items-center space-x-2">
        <app-button-primary (onClick)="toggleModal()" [label]="ADD + ' New Task'" />
        <app-button routerLink="/settings" [label]="FOLDER" />
        <app-button routerLink="/settings" [label]="ARCHIVE" />
        <app-button routerLink="/settings" [label]="SETTINGS" />
      </div>

      <app-modal [isOpen]="showModal()" (onClose)="toggleModal()" title="Test" class="absolute">
        <app-task-form [data]="task()" (onCancel)="toggleModal()" (onSubmit)="onSubmit($event)" />
      </app-modal>
    </div>
  `,
  styles: ``,
})
export class Header {
  ADD = ADD;
  FOLDER = FOLDER;
  ARCHIVE = ARCHIVE;
  SETTINGS = SETTINGS;

  private router = inject(Router);

  taskService = inject(TaskService);

  showModal = signal<boolean>(false);

  task = computed(() => this.taskService.getSampleNewTask());

  navigateToHome() {
    this.router.navigate(['/']);
  }

  toggleModal() {
    this.showModal.set(!this.showModal());
  }

  onSubmit(task: Task) {
    console.log(task.Id, '----', task);

    if (task.Id) {
      console.log("in add ")
      this.taskService.editTask(task.Id!, task);
    } else {
      console.log("edit")
      this.taskService.addTask(task);
    }

    console.log("end")

    this.toggleModal();
  }
}
