import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 30): string {
    if (!value) return '';

    const trimmed = value.trim();
    return trimmed.length > limit
      ? `${trimmed.substring(0, limit)}...`
      : trimmed;
  }
}
