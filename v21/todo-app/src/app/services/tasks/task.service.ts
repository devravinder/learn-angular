import { inject, Injectable, signal } from '@angular/core';
import { defaultTasks } from '../../util/data';
import { ConfigService } from '../config/config.service';
import { getId } from '../../util/common';

const SideEffectKey: Partial<{
  [K in keyof TodoConfig]: keyof Task | undefined;
}> = {
  Categories: 'Category',
  Priorities: 'Priority',
  Statuses: 'Status',
  Users: 'AssignedTo',
};

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  tasks = signal<Task[]>(defaultTasks);
  configService = inject(ConfigService);

  getSampleNewTask = (status?: string): Task => {
    return {
      Title: '',
      Status: status || this.configService.config()['Workflow Statuses']['CREATE_STATUS'],
      Description: '',
      Notes: '',
      Priority:
        this.configService.config().Priorities[this.configService.config().Priorities.length - 1],
      createdDate: new Date(),
      dueDate: new Date(),
      lastModifiedDate: new Date(),
      Tags: [],
      Subtasks: [],
    };
  };

  addTask = (task: Task) => {
    this.tasks.update((prev) => [
      ...prev,
      {
        ...task,
        Id: `${getId()}`,
        createdDate: new Date(),
      },
    ]);
  };

  editTask = (id: string, task: Partial<Task>) => {
    const old = this.tasks().find((task) => task.Id === id);

    if (old) {
      const { Status: targetStatus } = task;
      const { Status: currentStatus } = old;

      // Update timestamps based on status
      if (targetStatus !== currentStatus) {
        switch (targetStatus) {
          case this.configService.config()['Workflow Statuses']['START_STATUS']: {
            task.startedDate = new Date();
            break;
          }

          case this.configService.config()['Workflow Statuses']['END_STATUS']: {
            task.completedDate = new Date();
            break;
          }
        }
      }

      this.tasks.update((pre) =>
        pre.map((old) => (id === old.Id ? { ...old, ...task, lastModifiedDate: new Date() } : old)),
      );
    }
  };

  changeStatus = (id: string, status: string) => {
    this.editTask(id, { Status: status });
  };

  deleteTask = (taskId: string) => {
    this.tasks.update((prev) => prev.filter((task) => task.Id !== taskId));
  };

  updateTaskField = (key: keyof Task, from: Task[keyof Task], to: Task[keyof Task]) => {
    this.tasks.update((pre) => pre.map((old) => (old[key] === from ? { ...old, [key]: to } : old)));
  };

  handleSideEffects = (sideEffects: Change[]) => {
    for (const { key, oldValue, newValue, type } of sideEffects) {
      if (key in SideEffectKey && type === 'UPDATE') {
        this.updateTaskField(
          SideEffectKey[key as keyof TodoConfig]!,
          oldValue as string,
          newValue as string,
        );
        // for DELETE, we don't delete tasks
      }
    }
  };

  onConfigChange = (value: TodoConfig, sideEffects: Change[]) => {
    this.handleSideEffects(sideEffects);
  };
}
