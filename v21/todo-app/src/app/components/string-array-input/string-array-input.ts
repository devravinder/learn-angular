import { Component, effect, input, linkedSignal, output, signal } from '@angular/core';
import { ADD, MINUS } from '../../util/icons';
import { form, FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-string-array-input',
  imports: [FormField],
  template: `
    <div class="flex flex-col gap-4 overflow-auto max-h-92 p-2">
      <div class="w-full flex flex-row gap-2">
        <input
          type="text"
          [formField]="textForm"
          class="w-full px-3 py-2 border border-muted-foreground/30 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-transparent"
        />
        <button
          type="button"
          (click)="onNewTextAdd()"
          class="px-4 py-2 bg-primary cursor-pointer disabled:cursor-not-allowed text-accent-foreground rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-none"
        >
          {{ ADD }}
        </button>
      </div>

      @for (item of formData(); track $index; let index = $index) {
        <div class="w-full flex flex-row gap-2">
          <input
            type="text"
            [formField]="form[index]"
            (blur)="trackSideEffect(index, $event)"
            class="w-full px-3 py-2 border border-muted-foreground/30 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-transparent"
          />
          <button
            type="button"
            (click)="onArrayItemDelete(index)"
            class="cursor-pointer px-4 py-2 text-red-500 disabled:cursor-not-allowed disabled:bg-muted-foreground bg-red-200 hover:bg-red-300 rounded-lg"
          >
            {{ MINUS }}
          </button>
        </div>
      }
    </div>
  `,
  styles: ``,
})
export class StringArrayInput {
  ADD = ADD;
  MINUS = MINUS;
  onChange = output<string[]>();
  onSideEffect = output<Change>()
  
  key = input.required<string>()
  items = input.required<string[]>();

  indexMap = linkedSignal(()=> this.items().map((_,i)=>({initial: i, current: i}))) // to track changes by index
  formData = linkedSignal(() => this.items());
  form = form<string[]>(this.formData);

  text = signal('');
  textForm = form<string>(this.text);

  onArrayItemDelete(index: number) {
    this.form().value.update((pre) => pre.filter((_, i) => i !== index));

    this.indexMap.update(pre=> pre.map(ele=> {
      if(ele.current == index)
        ele.current = -Infinity
      if(ele.current > index){
        ele.current = ele.current - 1;
      }
      return ele;
    }))


  }
  onNewTextAdd() {
    const newText = this.text();
    if (!newText) return;
    this.formData.update((pre)=>[newText,...pre])
    // this.form().value.update((pre) => [newText, ...pre]); // same as above

    this.indexMap.update(pre=> pre.map(ele=> {
      ele.current = ele.current + 1
      return ele;
    }))

    this.form().markAsDirty()
    
    this.text.set('');
    //this.newTextForm().value.set('')
  }

  onDataChange(items: string[]) {
    if (this.form().dirty()){
      this.onChange.emit(items);

      console.log({
        old: this.items(),
        new: items,

        i : this.indexMap()

      })
    }
       
  }

  trackSideEffect(index: number, event: Event){
    const value = (event.target as HTMLInputElement).value.trim().toUpperCase();

    console.log({value, index, old: this.formData()[index]})
                  
  }

  constructor() {
    effect(() => {
      this.onDataChange(this.formData());
    });
  }
}
