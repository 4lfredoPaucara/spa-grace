import { Component, input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `
    <span class="spa-badge" [class]="color()">
      {{ label() }}
    </span>
  `,
})
export class StatusBadgeComponent {
  readonly color = input.required<string>();
  readonly label = input.required<string>();
}
