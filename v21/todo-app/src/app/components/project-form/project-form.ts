import { Component, inject, input, linkedSignal, output, signal } from '@angular/core';
import { ProjectService } from '../../services/project/project.service';
import { FileHandleService } from '../../services/util/file-handle/file-handle.service';
import { form, FormField } from '@angular/forms/signals';

export interface ProjectFormData {
  activeProjectId: string;
  projects: Project[];
}

@Component({
  selector: 'app-project-form',
  imports: [FormField],
  template: `
    <!-- project-form.component.html -->
    <form class="h-full flex flex-col justify-between">
      <div class="flex">
        <div class="flex-1 min-w-sm overflow-auto flex flex-col gap-4">
          <div class="p-4 flex flex-col gap-4">
            <!-- Active Project Selection -->
            <div class="flex">
              <div class="w-full flex flex-col gap-4 px-2">
                <label for="activeProjectId" class="block text-sm font-medium text-slate-700">
                  Active Project
                </label>
                <div class="w-full flex flex-row gap-2 pr-2">
                  <select
                    id="activeProjectId"
                    [formField]="form.activeProjectId"
                    class="grow px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  >
                    @for (project of formData().projects; track project.id) {
                      <option [value]="project.id">
                        {{ project.name }}
                      </option>
                    }
                  </select>

                  <button
                    (click)="onNewProjectClick()"
                    [disabled]="isOpening()"
                    type="button"
                    class="px-4 py-2 bg-blue-600 cursor-pointer disabled:cursor-not-allowed text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-none"
                  >
                    @if (isOpening()) {
                      <span class="animate-spin inline-block">+</span>
                    } @else {
                      <span>+</span>
                    }
                  </button>
                </div>
              </div>
            </div>

            <!-- Error Message -->
            <div class="flex flex-row justify-center items-center">
              @if (error()) {
                <span class="text-red-500 text-sm w-fit px-4">{{ error() }}</span>
              } @else {
                <span>&nbsp;&nbsp;&nbsp;</span>
              }
            </div>

            <!-- Projects List -->
            <div>
              <label for="projects" class="block text-sm font-medium text-slate-700 p-2">
                Projects
              </label>

              <div class="w-full flex flex-col gap-4 max-h-72 overflow-y-auto">
                @for (project of formData().projects; track project.id; let i = $index) {
                  <div class="flex flex-row gap-2 p-2">
                    <input
                      [formField]="form.projects[i].name"
                      type="text"
                      (keydown)="onKeyDown($event)"
                      class="grow px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      [disabled]="isActiveProject(project.id)"
                      (click)="onDeleteProject(i)"
                      class="cursor-pointer px-4 py-2 text-red-500 disabled:cursor-not-allowed disabled:bg-gray-300 bg-red-100 hover:bg-red-200 rounded-lg"
                    >
                      -
                    </button>
                  </div>
                } @empty {
                  <div class="text-center py-8 text-slate-400">
                    <p class="text-sm">No projects configured</p>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="flex gap-4 py-4 px-4 items-end justify-between border-t border-slate-200">
        <div class="flex flex-row gap-4">
          <button
            type="button"
            (click)="handleCancel()"
            class="cursor-pointer px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300"
          >
            Cancel
          </button>
        </div>
        <div class="flex flex-row gap-4">
          <button
            type="button"
            (click)="handleReset()"
            class="cursor-pointer px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300"
          >
            Reset
          </button>
          <button
            type="submit"
            class="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  `,
  styles: ``,
})
export class ProjectForm {
  // Inputs/Outputs
  data = input.required<ProjectFormData>();
  readonly formData = linkedSignal(() => this.data());
  onCancel = output<void>();
  onSave = output<ProjectFormData>();

  protected readonly form = form<ProjectFormData>(this.formData);

  // Services
  private projectService = inject(ProjectService);
  private fileHandler = inject(FileHandleService);

  // State
  error = signal('');
  isOpening = signal(false);

  async onNewProjectClick() {
    this.error.set('');
    this.isOpening.set(true);

    try {
      const fileHandleResult = await this.fileHandler.openFolder();

      if ('handle' in fileHandleResult) {
        const currentProjects = this.formData().projects;
        let isExists = false;

        for (const item of currentProjects) {
          if (item.fileHandle && (await item.fileHandle.isSameEntry(fileHandleResult.handle))) {
            isExists = true;
            break;
          }
        }

        if (isExists) {
          this.error.set('Already exists');
          return;
        }

        const newProject = this.projectService.getSampleNewProject(
          fileHandleResult.handle,
          fileHandleResult.path,
        );
        this.form.projects().value.update((pre) => [...pre, newProject]);
      }
    } catch (err) {
      console.error('Failed to open folder', err);
    } finally {
      this.isOpening.set(false);
    }
  }

  async onDeleteProject(index: number) {
    const project = this.formData().projects.at(index);
    await this.projectService.deleteProject(project!.id);

    this.form.projects().value.update((pre) => pre.filter((_, i) => i !== index));
  }

  isActiveProject(projectId: string): boolean {
    return this.form.activeProjectId().value() === projectId;
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }

  handleCancel() {
    this.onCancel.emit();
  }

  handleReset() {
    this.form().reset(this.data());
    this.error.set('');
  }

  handleSubmit() {
    const value = this.form().value();
    this.onSave.emit(value);
  }
}
