import { Component, input, output, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="relative">
      <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
      </svg>
      <input
        type="text"
        [ngModel]="value()"
        (ngModelChange)="onInput($event)"
        [placeholder]="placeholder()"
        class="input-spa pl-10"
      />
      @if (value()) {
        <button
          type="button"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          (click)="clear()"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      }
    </div>
  `,
})
export class SearchInputComponent {
  readonly value = model('');
  readonly placeholder = input('Buscar...');
  readonly debounce = input(300);

  readonly search = output<string>();

  private searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject
      .pipe(debounceTime(this.debounce()), distinctUntilChanged())
      .subscribe((val) => this.search.emit(val));
  }

  onInput(val: string) {
    this.value.set(val);
    this.searchSubject.next(val);
  }

  clear() {
    this.value.set('');
    this.search.emit('');
  }
}
