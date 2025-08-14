// Removed duplicate onLimitChange declaration outside the class
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class PaginatorComponent {
  onLimitChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.changeLimit(Number(value));
  }
  @Input() total = 0;
  @Input() limit = 10;
  @Input() offset = 0;
  @Input() page = 1;
  @Input() noControl = false;
  @Input() pageSizeOptions: number[] = [5, 10, 25, 50, 100];

  @Output() pageChanged = new EventEmitter<number>();
  @Output() limitChanged = new EventEmitter<number>();

  get first(): number {
    if (this.total === 0) return 0;
    return this.offset + 1;
  }

  get last(): number {
    if (this.total === 0) return 0;
    const last = this.offset + this.limit;
    return last > this.total ? this.total : last;
  }

  get totalPages(): number {
    return Math.ceil(this.total / this.limit) || 1;
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.pageChanged.emit(page);
  }

  changeLimit(val: number) {
    this.limitChanged.emit(+val);
  }
}
