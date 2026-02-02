declare global {
  interface Window {
    showDirectoryPicker(options?: {
      id?: string;
      mode?: 'read' | 'readwrite';
      startIn?: 'desktop' | 'documents' | 'downloads' | 'music' | 'pictures' | 'videos';
    }): Promise<FileSystemDirectoryHandle>;
  }

  interface FileSystemDirectoryHandle {
    entries(): AsyncIterableIterator<[string, FileSystemHandle]>;
  }
  interface Task {
    Id?: string;
    Title: string;
    Description?: string;
    Priority: string;
    AssignedTo?: string;
    createdDate: string | Date;
    startedDate?: string | Date;
    dueDate: string | Date;
    completedDate?: string | Date;
    lastModifiedDate?: string | Date;
    Tags?: string[];
    Subtasks?: string[];
    Notes?: string;
    Status: string;
    Category?: string;
  }

  interface Color {
    'text-color': string;
    'bg-color': string;
  }
  interface TodoConfig {
    Statuses: string[];
    'Workflow Statuses': {
      CREATE_STATUS: string;
      START_STATUS: string;
      END_STATUS: string;
      ARCHIVE_STATUS: string;
    };
    Categories: string[];
    Users: string[];
    Priorities: string[];
    'Priority Colors': Record<string, Color>;
    Tags: string[];
  }
  type Change = {
    key: string;
    oldValue?: unknown;
    newValue?: unknown;
    type: 'ADD' | 'UPDATE' | 'DELETE';
  };
  type FileFormat = 'md' | 'json';

  type SideEffect = (change: Change) => void;

  type ArrayKeys<T> = {
    [K in keyof T]: T[K] extends string[] ? K : never;
  }[keyof T];

  type JSONObject = {
    [key: string]: string | string[] | JSONObject;
  };
  type NonStringKeysWithUndefined<T> = {
    [K in keyof T]: NonNullable<T[K]> extends string | string[] ? never : K;
  }[keyof T];

  type NonStringKeys<T> = Exclude<NonStringKeysWithUndefined<T>, undefined>;
}

export {};
