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

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatBadgeModule
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
    // articles = [
    //     {
    //       id: 1,
    //       title: 'Getting Started with Knowledge Management',
    //       description: 'Learn the fundamentals of organizing and sharing knowledge effectively across your organization.',
    //       tags: ['beginner', 'foundations', 'onboarding'],
    //       category: 'Introduction',
    //       image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    //       author: 'Sarah Johnson',
    //       authorAvatar: 'https://randomuser.me/api/portraits/women/32.jpg'
    //     },
    //     {
    //       id: 2,
    //       title: 'Advanced Search Techniques',
    //       description: 'Master the art of finding exactly what you need with these powerful search strategies.',
    //       tags: ['search', 'queries', 'advanced'],
    //       category: 'Search',
    //       image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    //       author: 'Michael Chen',
    //       authorAvatar: 'https://randomuser.me/api/portraits/men/42.jpg'
    //     },
    //     {
    //       id: 3,
    //       title: 'Collaborative Documentation',
    //       description: 'How to create living documents that evolve with your team\'s collective knowledge.',
    //       tags: ['collaboration', 'docs', 'teamwork'],
    //       category: 'Collaboration',
    //       image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    //       author: 'Emma Davis',
    //       authorAvatar: 'https://randomuser.me/api/portraits/women/63.jpg'
    //     },
    //     {
    //       id: 4,
    //       title: 'Knowledge Retention Strategies',
    //       description: 'Prevent critical knowledge loss when team members transition to new roles.',
    //       tags: ['retention', 'best-practices', 'hr'],
    //       category: 'Best Practices',
    //       image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    //       author: 'David Wilson',
    //       authorAvatar: 'https://randomuser.me/api/portraits/men/33.jpg'
    //     },
    //     {
    //       id: 5,
    //       title: 'Tagging and Categorization',
    //       description: 'Create an intuitive taxonomy that makes content discovery effortless.',
    //       tags: ['taxonomy', 'organization', 'metadata'],
    //       category: 'Organization',
    //       image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    //       author: 'Lisa Rodriguez',
    //       authorAvatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    //     },
    //     {
    //       id: 6,
    //       title: 'Measuring Knowledge Impact',
    //       description: 'Quantify how your knowledge base contributes to organizational success.',
    //       tags: ['analytics', 'metrics', 'kpis'],
    //       category: 'Analytics',
    //       image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    //       author: 'James Miller',
    //       authorAvatar: 'https://randomuser.me/api/portraits/men/75.jpg'
    //     }
    //   ];
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