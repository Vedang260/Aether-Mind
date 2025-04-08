import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { SearchService } from '../../core/services/search.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  showDropdown = false;
  searchQuery = '';
  user: any = null;
  private destroy$ = new Subject<void>();
  private placeholderInterval: any;
  currentPlaceholder = 'Search by title...';
  placeholders = [
    'Search by title...',
    'Search by tags...',
    'Search by category...',
    'Search by author...'
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    this.startPlaceholderRotation();
    const storedUser = localStorage.getItem('auth_user');
    this.user = storedUser ? JSON.parse(storedUser) : null;
    
    // Setup search debounce
    this.setupSearchDebounce();
  }

  private setupSearchDebounce(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(query => {
      this.handleSearch(query);
    });
  }

  public searchSubject = new Subject<string>();

  private handleSearch(query: string): void{
    this.searchService.setSearchQuery(query);
  }
  onSearch(): void {
    this.searchSubject.next(this.searchQuery);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchSubject.next('');
  }

  startPlaceholderRotation(): void {
    let index = 0;
    this.placeholderInterval = setInterval(() => {
      index = (index + 1) % this.placeholders.length;
      this.currentPlaceholder = this.placeholders[index];
    }, 3000);
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  viewProfile(): void {
    this.showDropdown = false;
    this.router.navigate(['/profile']);
  }

  logout(): void {
    this.showDropdown = false;
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    if (this.placeholderInterval) {
      clearInterval(this.placeholderInterval);
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
}