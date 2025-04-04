import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(
    private toastr: ToastrService,
  ) {}

  showSuccess(message: string): void {
    this.toastr.success(message, 'Success', {
      toastClass: 'success-toast',
      timeOut: 3000,
      progressBar: true,
      closeButton: true,
      positionClass: 'toast-top-right'
    });
  }
  
  showError(message: string): void {
    this.toastr.error(message, 'Error', { 
      toastClass: 'error-toast',
      timeOut: 3000,
      progressBar: true,
      closeButton: true,
      positionClass: 'toast-top-right',
      enableHtml: false,
      tapToDismiss: false
    });
  }
}