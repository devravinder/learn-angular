import { Component, computed, inject } from '@angular/core';
import { SettingsForm } from '../../../components/settings-form/settings-form';
import { Modal } from '../../../components/modal/modal';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../../services/tasks/task.service';

@Component({
  selector: 'app-settings',
  imports: [SettingsForm, Modal],
  template: `
    <app-modal [isOpen]="true" (onClose)="goToParent()" title="Settings" class="absolute">
      <app-settings-form
        [data]="formData()"
        (onCancel)="goToParent()"
        (onSave)="onSubmit($event)"
      />
    </app-modal>
  `,
  styles: ``,
})
export class Settings {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  taskSerive = inject(TaskService);

  formData = computed(() => this.taskSerive.config());

  goToParent() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  async onSubmit(data: TodoConfig) {
    console.log({ data });
    this.goToParent();
  }
}

export default Settings;
