import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';

@Pipe({
  name: 'createdAtDate',
})
export class CreatedAtDatePipe implements PipeTransform {
  transform(value: Date | Timestamp | null | undefined): string {
    if (!value) return 'Created at: Unknown date';

    const date = value instanceof Timestamp ? value.toDate() : value;

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `Created at: ${year}. ${month}. ${day}. ${hours}:${minutes}`;
  }
}
