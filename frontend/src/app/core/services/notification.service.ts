import { Injectable, TemplateRef } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { NotificationComponent } from '../../components/notification/notification.component';
import { Notification, NotificationType } from '../../components/notification/notification.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private defaultDuration = 5000;

  constructor(private snackBar: MatSnackBar) {}

  show(notification: Notification, template?: TemplateRef<any>): MatSnackBarRef<NotificationComponent> {
    return this.snackBar.openFromComponent(NotificationComponent, {
      data: { notification, template },
      duration: notification.duration || this.defaultDuration,
      panelClass: ['notification-overlay'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  success(message: string, duration?: number): MatSnackBarRef<NotificationComponent> {
    return this.show({ 
      type: 'success', 
      message, 
      duration 
    });
  }

  error(message: string, duration?: number): MatSnackBarRef<NotificationComponent> {
    return this.show({ 
      type: 'error', 
      message, 
      duration 
    });
  }

  info(message: string, duration?: number): MatSnackBarRef<NotificationComponent> {
    return this.show({ 
      type: 'info',  // Fixed from empty string to 'info'
      message, 
      duration 
    });
  }

  warning(message: string, duration?: number): MatSnackBarRef<NotificationComponent> {
    return this.show({ 
      type: 'warning', 
      message, 
      duration 
    });
  }
}