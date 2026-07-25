import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'readableDate', standalone: true })
export class ReadableDatePipe implements PipeTransform {
  transform(value: string | Date | null | undefined, format: 'short' | 'long' | 'time' = 'short'): string {
    if (!value) return '-';
    const date = new Date(value);
    if (isNaN(date.getTime())) return '-';
    if (format === 'time') {
      return date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
    }
    if (format === 'long') {
      return date.toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' });
    }
    return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
}
