import { NgClass } from '@angular/common';
import { Component, computed, input, linkedSignal, output, signal } from '@angular/core';
import { form } from '@angular/forms/signals';
import { ADD, MINUS } from '../../util/icons';
import { StringArrayInput } from '../string-array-input/string-array-input';
import { WorkflowStatusInput } from '../workflow-status-input/workflow-status-input';
import { ColorPicker } from '../color-picker/color-picker';
import { ColorInputGroup } from '../color-input-group/color-input-group';

type StringArrayKey = ArrayKeys<TodoConfig>;

@Component({
  selector: 'app-settings-form',
  imports: [NgClass, StringArrayInput, WorkflowStatusInput, ColorInputGroup],
  template: `
    <div class="w-full flex-1 flex flex-col">
      <div class="flex-1 flex flex-row w-full">
        <div class="w-48 border-r border-border">
          <nav class="p-4 space-y-1 w-full">
            @for (tab of tabs(); track tab) {
              <button
                type="button"
                (click)="onTabClick(tab)"
                class="w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                [ngClass]="
                  activeTab() == tab
                    ? 'bg-primary/15 text-primary'
                    : 'text-muted-foreground hover:bg-secondary-darker'
                "
              >
                {{ tab }}
              </button>
            }
          </nav>
        </div>
        <div class="flex-1 flex flex-col gap-2 p-4 overflow-auto">
          <h3 class="text-lg font-medium text-foreground px-2">Manage {{ activeTab() }}</h3>
          @if (items().length) {
            <app-string-array-input
              [items]="items()"
              (onChange)="onStringArrayChange(activeTab(), $event)"
            />
          }
          @if (activeTab() === 'Workflow Statuses') {
            <app-workflow-status-input
              [workFlow]="formData()['Workflow Statuses']"
              [statuses]="formData()['Statuses']"
              (onChange)="onWorkFlowChange($event)"
            />
          }

          @if (activeTab() === 'Priority Colors') {
            <app-color-input-group />
          }
        </div>
      </div>
      <!-- Form Actions -->
      <div class="flex w-full gap-4 p-4 px-6 items-end justify-between border-t border-border">
        <div class="flex flex-row gap-4">
          <button
            type="button"
            (click)="handleCancel()"
            class="cursor-pointer px-4 py-2 bg-secondary-dark text-muted-foreground rounded-md hover:bg-secondary-darker"
          >
            Cancel
          </button>
        </div>
        <div class="flex flex-row gap-4">
          <button
            type="button"
            (click)="handleReset()"
            class="cursor-pointer px-4 py-2 bg-secondary-dark text-muted-foreground rounded-md hover:bg-secondary-darker"
          >
            Reset
          </button>
          <button
            type="button"
            (click)="handleSubmit()"
            class="cursor-pointer px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export class SettingsForm {
  Array = Array;
  ADD = ADD;
  MINUS = MINUS;
  onCancel = output<void>();
  onSave = output<TodoConfig>();
  data = input.required<TodoConfig>();
  readonly formData = linkedSignal(() => this.data());
  protected readonly form = form<TodoConfig>(this.formData);

  tabs = computed(() => Object.keys(this.data()) as (keyof TodoConfig)[]);
  activeTab = linkedSignal<keyof TodoConfig>(() => this.tabs()[0] as keyof TodoConfig);

  items = computed<string[]>(() =>
    Array.isArray(this.data()[this.activeTab()])
      ? (this.formData()[this.activeTab()] as string[])
      : [],
  );

  newText = signal('');
  newTextForm = form<string>(this.newText);

  handleCancel() {
    this.onCancel.emit();
  }

  handleReset() {
    this.form().reset(this.data());
  }

  handleSubmit() {
    const value = this.form().value();
    this.onSave.emit(value);
  }
  onTabClick = (tab: keyof TodoConfig) => {
    this.activeTab.set(tab as StringArrayKey);
  };

  onStringArrayChange(tab: keyof TodoConfig, values: string[]) {
    this.form[tab as StringArrayKey]().value.set(values);
  }

  onWorkFlowChange(data: TodoConfig['Workflow Statuses']) {
    this.form['Workflow Statuses']().value.set(data);
  }
}
