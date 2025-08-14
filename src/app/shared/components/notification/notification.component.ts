
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  standalone: true,
  imports: [NgClass, NgIf],
})
export class NotificationComponent {
  @Input() message = '';
  @Input() type: 'success' | 'error' | 'info' = 'success';
  @Input() show = false;
  @Output() closed = new EventEmitter<void>();

  onClose() {
    this.closed.emit();
  }
}
