import { Component, computed, effect, input, linkedSignal, output, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';

type WorkflowStatuses = TodoConfig['Workflow Statuses'];

@Component({
  selector: 'app-workflow-status-input',
  standalone: true,
  imports: [FormField],
  template: `
    <div class="p-2 flex flex-col gap-4">
      @for (key of keys(); track key) {
        <div class="flex flex-col gap-2">
          <label class="block text-sm font-medium text-foreground/80">{{ key }}</label>

          <select
            [formField]="form[key]"
            class="w-full px-3 py-2 border border-muted-foreground/30 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-transparent"
          >
            <option value="">Unassigned</option>
            @for (status of statuses(); track status) {
              <option [value]="status">{{ status }}</option>
            }
          </select>
        </div>
      } @empty {
        <p class="text-sm text-muted-foreground italic p-4">No workflow statuses defined yet</p>
      }
    </div>
  `,
})
export class WorkflowStatusInput {
  workFlow = input.required<WorkflowStatuses>();
  statuses = input.required<string[]>();

  onChange = output<WorkflowStatuses>();

  private formData = linkedSignal(() => this.workFlow());
  protected form = form<WorkflowStatuses>(this.formData);

  keys = computed(() => Object.keys(this.formData()) as (keyof WorkflowStatuses)[]);

  onDataChange(data: WorkflowStatuses) {
    if (this.form().dirty()) {
      this.onChange.emit(data);
    }
  }

  constructor() {
    effect(() => {
      this.onDataChange(this.formData());
    });
  }
}
