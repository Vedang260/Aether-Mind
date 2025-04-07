import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
//import { UserService } from '../../core/services/user.service';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  showDropdown = false;
  currentPlaceholder = 'Search by title...';
  user: any = null;
  placeholders = [
    'Search by title...',
    'Search by tags...',
    'Search by category...',
    'Search by author...'
  ];
  private placeholderInterval: any;

  constructor(
    private authService: AuthService,
    //private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.startPlaceholderRotation();
    //this.user = this.userService.getCurrentUser();
    const storedUser = localStorage.getItem('auth_user');
    this.user = storedUser ? JSON.parse(storedUser) : null;
  }

  startPlaceholderRotation() {
    let index = 0;
    this.placeholderInterval = setInterval(() => {
      index = (index + 1) % this.placeholders.length;
      this.currentPlaceholder = this.placeholders[index];
    }, 3000);
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  viewProfile() {
    this.showDropdown = false;
    this.router.navigate(['/profile']);
  }

  logout() {
    this.showDropdown = false;
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    if (this.placeholderInterval) {
      clearInterval(this.placeholderInterval);
    }
  }
}