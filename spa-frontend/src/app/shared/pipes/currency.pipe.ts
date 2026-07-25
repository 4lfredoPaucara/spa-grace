import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'currencyArs', standalone: true })
export class CurrencyArsPipe implements PipeTransform {
  transform(value: number | null | undefined, symbol: string = '$'): string {
    if (value == null) return '-';
    return `${symbol} ${value.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}
