import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';

@Component({
  selector: 'app-root',
  imports: [Header, RouterOutlet],
  template: `
    <div class="w-full h-screen flex flex-col">
      <app-header class="w-full border-b shadow border-border px-4 py-3" />
      <main class="w-full max-w-8xl mx-auto flex-1 flex flex-col overflow-hidden">
        <div class="w-full h-full overflow-auto flex justify-around gap-4 p-8">
        <router-outlet />
        </div>
      </main>
    </div>
  `,
  styles: [],
})
export class App {
  protected readonly title = signal('todo-app');
}
