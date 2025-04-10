import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { trigger, transition, style, animate } from '@angular/animations';
import { MatSpinner } from '@angular/material/progress-spinner';
import { Users, UsersResponse } from '../../../../shared/models/user.model';
import { UsersService } from '../../../../core/services/users.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSelectModule,
    MatPaginatorModule,
    MatSpinner
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class UsersComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['id', 'username', 'email', 'role', 'actions'];
  dataSource = new MatTableDataSource<Users>();
  isLoading = false;

  constructor(   
    private snackBar: MatSnackBar,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.fetchUsers();
    this.dataSource.paginator = this.paginator;
  }

  fetchUsers(): void {
    this.isLoading = true;
    this.usersService.getUsers().subscribe({
      next: (response: UsersResponse) => {
        if (response.success) {
          console.log(response);
          this.dataSource.data = response.users;
          this.dataSource.paginator = this.paginator;
          this.isLoading = false;
        } else {
          this.showSnackbar('Failed to load users', 'error');
          this.isLoading = false;
        }
      },
      error: () => {
        this.showSnackbar('Error fetching users', 'error');
        this.isLoading = false;
      }
    });
  }

  deleteUser(id: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.isLoading = true;
      this.usersService.deleteUser(id).subscribe({
        next: (response: any) => {
          if(response.success){
            this.handleSuccess('Category deleted successfully');
            this.fetchUsers(); // Refresh list
          }else{
            this.handleError(response.message);
          }
        },
        error: () => this.handleError('Failed to delete user')
      });
    }
  }

  handleSuccess(message: string) {
    this.showSnackbar(message, 'success');
    this.isLoading = false;
  }

  handleError(message: string) {
    this.showSnackbar(message, 'error');
    this.isLoading = false;
  }

  showSnackbar(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: type === 'success' ? 'snackbar-success' : 'snackbar-error'
    });
  }
}