import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MatIconModule } from '@angular/material/icon';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        ReactiveFormsModule, MatIconModule],
    animations: [
        trigger('cardAnimation', [
            state('void', style({
            opacity: 0,
            transform: 'translateY(20px)'
            })),
            transition('void => *', [
            animate('0.5s ease-out')
            ])
        ])
    ],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})
export class LoginComponent {
    loginForm: FormGroup;
    hide: boolean = true;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private notification: NotificationService,
        private toastr: ToastrService,
        private router: Router
    ){
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    onSubmit(): void {
        if(this.loginForm.valid){
            this.authService.login(
                this.loginForm.value.email,
                this.loginForm.value.password
            ).subscribe({
                next: (response: any) => {
                    //console.log('Login response', response);
                    if(response.success){
                        this.notification.showSuccess(response.message);
                        //this.router.navigate(['/dashboard']);
                    }else{
                        this.notification.showError(response.message);
                    }
                },
                error: (err: any) => this.notification.showError(err.message)
            });
        }
    }
}