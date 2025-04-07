import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate, stagger, query } from '@angular/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatBadgeModule } from '@angular/material/badge';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, forkJoin, map, of } from 'rxjs';
import { ApiResponse } from '../../shared/models/articles.model';
import { Category, CategoryResponse } from '../../shared/models/category.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatBadgeModule,
    RouterModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  animations: [
    trigger('cardAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger('100ms', [
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class DashboardComponent implements OnInit{
  articles: any[] = [];
  categories: Category[] = []; 
  isLoading: boolean | undefined;
  error: string | undefined;

  constructor(private http: HttpClient) {}
  
  ngOnInit(): void {
    this.fetchArticlesAndCategories();
  }
    fetchArticlesAndCategories(): void {
      const token = localStorage.getItem('auth_token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
  
      // Create requests for both articles and categories
      const articlesRequest = this.http.get<ApiResponse>('http://localhost:8000/api/articles', { headers });
      const categoriesRequest = this.http.get<CategoryResponse>('http://localhost:8000/api/category', { headers });
  
      // Use forkJoin to make both requests simultaneously
      forkJoin([articlesRequest, categoriesRequest]).pipe(
        catchError(error => {
          this.isLoading = false;
          this.error = error.message || 'Failed to load data. Please try again later.';
          return of([]);
        }),
        map(([articlesRes, categoriesRes]) => {
          // Check if both requests were successful
          if (!articlesRes.success || !categoriesRes.success) {
            throw new Error(articlesRes.message || categoriesRes.message || 'Failed to load data');
          }
  
          // Store categories for later use
          this.categories = categoriesRes.categories;
  
          // Map articles to the format your template expects
          return articlesRes.articles.map(article => ({
            id: article.article_id,
            title: article.title,
            description: article.description,
            tags: article.tags,
            category: this.getCategoryName(article.category_id),
            image: article.image_url,
            author: 'Unknown Author', // You can implement author lookup similarly
            authorAvatar: 'https://randomuser.me/api/portraits/men/1.jpg'
          }));
        })
      ).subscribe({
        next: (mappedArticles) => {
          this.articles = mappedArticles;
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          this.error = 'Failed to load articles. Please try again later.';
        }
      });
    }
  
    // Helper method to get category name from ID
    private getCategoryName(categoryId: string): string {
      const category = this.categories.find(c => c.category_id === categoryId);
      return category ? category.name : 'Uncategorized';
    }
}