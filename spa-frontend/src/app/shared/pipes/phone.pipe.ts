import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'phone', standalone: true })
export class PhonePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '-';
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 10) {
      return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 9)}-${cleaned.slice(9)}`;
    }
    return value;
  }
}
