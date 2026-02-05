import { Component, input } from '@angular/core';
import { ColorPicker } from '../color-picker/color-picker';
import { ColorPreview } from '../color-preview/color-preview';

@Component({
  selector: 'app-color-input-group',
  imports: [ColorPicker, ColorPreview],
  template: `<div class="flex flex-row items-start gap-4 border border-red-500">
    <app-color-preview [label]="label()" [color]="color()" />
    <app-color-picker label="Text Color" [value]="color()['text-color']" />
    <app-color-picker label="Bg Color" [value]="color()['bg-color']" />
  </div> `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export class ColorInputGroup {
  color = input<Color>({ 'text-color': '#ffffff', 'bg-color': '#3b82f6' });
  label = input<string>('Label');
}
