import { Component, input, output } from '@angular/core';
import { CLOSE } from '../../util/icons';

@Component({
  selector: 'app-modal',
  imports: [],
  template: `
    @if (isOpen()) {
      <div
        class="fixed inset-0 bg-gray-400/30 backdrop-blur flex items-center justify-center p-4 z-50"
      >
        <div class="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between p-6 border-b border-slate-200">
            <h2 class="text-lg font-semibold text-slate-800">
              {{ title() }}
            </h2>
            <button
              (click)="onClose.emit()"
              class="cursor-pointer text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              {{ CLOSE }}
            </button>
          </div>
          <ng-content />
        </div>
      </div>
    }
  `,
  styles: ``,
})
export class Modal {
  CLOSE = CLOSE;
  title = input.required<string>();
  isOpen = input.required<boolean>();

  onClose = output();
}
