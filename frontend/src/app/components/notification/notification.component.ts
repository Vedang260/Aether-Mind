import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id?: string;
  type: NotificationType;
  message: string;
  duration?: number;
  icon?: string;
}

@Component({
  selector: 'app-notification',
  imports: [
    CommonModule,
    MatIconModule,
  
  ],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
  animations: [
    trigger('notificationAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)', 
          style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)', 
          style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class NotificationComponent {
  @Input() notification!: Notification;
  @Input() template?: TemplateRef<any>;
  @Output() closed = new EventEmitter<void>();
  
  // Close handler method
  onClose(): void {
    this.closed.emit();
  }
  
  get icon(): string {
    if (this.notification.icon) return this.notification.icon;
    
    switch (this.notification.type) {
      case 'success': return 'check_circle';
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': 
      default: return 'info';
    }
  }

  get colorClass(): string {
    switch (this.notification.type) {
      case 'success': return 'notification-success';
      case 'error': return 'notification-error';
      case 'warning': return 'notification-warning';
      case 'info': 
      default: return 'notification-info';
    }
  }
}