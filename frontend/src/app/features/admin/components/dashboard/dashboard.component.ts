import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { dashboardAnalytics } from '../../../../shared/models/dashboardAnalytics.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    RouterModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  analytics: dashboardAnalytics | null = null;
  stats: any[] = [];

  constructor( private http: HttpClient ){}

  ngOnInit() {
    this.fetchAnalytics();
  }

  fetchAnalytics(): any {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get<any>('http://localhost:8000/api/analytics', { headers })
    .subscribe({
      next: (response) => {
        if (response?.success && response?.analytics) {
          this.analytics = response.analytics;
          this.initializeStats();
          this.animateCounters();
        } else {
          console.error('Unexpected response format', response);
        }
      },
      error: (error) => {
        console.error('Error fetching analytics:', error);
      }
    });
  }

  initializeStats() {
    this.stats = [
      { icon: 'article', title: 'Total Articles', value: this.analytics?.totalArticles, displayValue: '0', color: 'linear-gradient(135deg, #6e8efb, #a777e3)' },
      { icon: 'category', title: 'Total Categories', value: this.analytics?.totalCategories, displayValue: '0', color: 'linear-gradient(135deg, #4CAF50, #8BC34A)' },
      { icon: 'people', title: 'Total Users', value: this.analytics?.totalUsers, displayValue: '0', color: 'linear-gradient(135deg, #FF9800, #FFC107)' },
      { icon: 'comment', title: 'Total Comments', value: this.analytics?.totalComments, displayValue: '0', color: 'linear-gradient(135deg, #9C27B0, #E91E63)' },
      { icon: 'visibility', title: 'Total Views', value: this.analytics?.totalViews, displayValue: '0', color: 'linear-gradient(135deg, #00BCD4, #03A9F4)' }
    ];
  }

  animateCounters() {
    this.stats.forEach((stat, index) => {
      const duration = 2000; // 2 seconds
      const startTime = Date.now();
      const endValue = stat.value;
      const startValue = 0;
      
      const animate = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / duration, 1);
        const currentValue = Math.floor(progress * (endValue - startValue) + startValue);
        
        // Format the number with commas
        stat.displayValue = currentValue.toLocaleString();
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          stat.displayValue = endValue.toLocaleString();
        }
      };
      
      // Stagger the animations slightly
      setTimeout(animate, index * 150);
    });
  }
}