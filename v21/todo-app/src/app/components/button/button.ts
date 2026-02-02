import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  template: `<button
    (click)="onClick.emit()"
    class="cursor-pointer inline-flex items-center px-3 py-2 bg-slate-100 text-sm font-medium rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-none transition-colors"
  >
    {{ label() }}
  </button>`,
  styles: ``,
})
export class Button {
  label = input('Button');
  onClick = output();
}
