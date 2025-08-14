import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeClientPrefix',
  standalone: true
})
export class RemoveClientPrefixPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return 'Non défini';
    const cleaned = value.replace(/^client\s*/i, '').trim();
    return cleaned || 'Non défini';
  }
}
