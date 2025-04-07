import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';

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
  stats = [
    { icon: 'article', title: 'Total Articles', value: 1248, displayValue: '0', color: 'linear-gradient(135deg, #6e8efb, #a777e3)' },
    { icon: 'category', title: 'Total Categories', value: 12, displayValue: '0', color: 'linear-gradient(135deg, #4CAF50, #8BC34A)' },
    { icon: 'people', title: 'Total Users', value: 5672, displayValue: '0', color: 'linear-gradient(135deg, #FF9800, #FFC107)' },
    { icon: 'comment', title: 'Total Comments', value: 8341, displayValue: '0', color: 'linear-gradient(135deg, #9C27B0, #E91E63)' },
    { icon: 'visibility', title: 'Total Views', value: 124856, displayValue: '0', color: 'linear-gradient(135deg, #00BCD4, #03A9F4)' }
  ];

  ngOnInit() {
    this.animateCounters();
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