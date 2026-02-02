import { Injectable, signal } from '@angular/core';
import { defaultConfig } from '../../util/constants';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  config = signal<TodoConfig>(defaultConfig)
}
