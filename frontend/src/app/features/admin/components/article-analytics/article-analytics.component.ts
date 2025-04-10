import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnalyticsService } from '../../../../core/services/analytics.service';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexNonAxisChartSeries,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexPlotOptions,
  ApexFill,
  ApexStroke,
  ApexLegend,
  NgApexchartsModule
} from 'ng-apexcharts';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { trigger, transition, style, animate } from '@angular/animations';
import { MatSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-article-analytics',
  standalone: true,
  imports: [
    CommonModule,
    NgApexchartsModule,
    MatIconModule,
    MatCardModule,
    MatSpinner
  ],
  templateUrl: './article-analytics.component.html',
  styleUrls: ['./article-analytics.component.css'],
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
export class ArticleAnalyticsComponent implements OnInit {
  articleId: string | null = null;
  analyticsData: any = {};
  isLoading = false;

  // Chart Configurations
  commentHeatmapChart: ApexChart = {
    type: 'heatmap',
    height: 300,
    toolbar: { show: true }
  };
  commentHeatmapSeries: ApexAxisChartSeries = [];

  ratingChart: ApexChart = {
    type: 'radialBar',
    height: 300,
    toolbar: { show: false }
  };
  ratingSeries: ApexNonAxisChartSeries = [];
  ratingLabels: string[] = [];

  engagementChart: ApexChart = {
    type: 'line',
    height: 300,
    toolbar: { show: true },
    animations: {
        enabled: true,
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      }    
  };
  engagementSeries: ApexAxisChartSeries = [];
  engagementXAxis: ApexXAxis = { type: 'datetime' };

  comparisonMatrixChart: ApexChart = {
    type: 'scatter',
    height: 300,
    toolbar: { show: true },
    animations: {
        enabled: true,
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      }    
  };
  comparisonMatrixSeries: ApexAxisChartSeries = [];

  constructor(
    private route: ActivatedRoute,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit() {
    this.articleId = this.route.snapshot.paramMap.get('id');
    if (this.articleId) {
      this.fetchData(this.articleId);
    }
  }

  fetchData(articleId: string) {
    this.isLoading = true;
    this.analyticsService.getArticleAnalytics(articleId).subscribe({
      next: (data) => {
        this.analyticsData = data.analytics;
        this.prepareCharts();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load article analytics:', err);
        this.isLoading = false;
      }
    });
  }

  prepareCharts() {
    // Comment Heatmap
    this.commentHeatmapSeries = this.groupHeatmapData(this.analyticsData.commentHeatmap);

    // Rating Distribution Radial Bar
    const ratingData = this.analyticsData.ratingDistribution || [];
    this.ratingSeries = ratingData.map((item: any) => 
      Math.round((parseInt(item.rating) / 5) * 100)
    );
    this.ratingLabels = ratingData.map((item: any) => `${item.title} (${item.rating}★)`);

    // Weekly Engagement Line Chart
    this.engagementSeries = [
      {
        name: 'Comments',
        data: this.analyticsData.weeklyEngagement
          .filter((item: any) => parseInt(item.total_comments) > 0)
          .map((item: any) => ({
            x: new Date(item.week).getTime(),
            y: parseInt(item.total_comments)
          }))
      },
      {
        name: 'Ratings',
        data: this.analyticsData.weeklyEngagement
          .filter((item: any) => parseInt(item.total_ratings) > 0)
          .map((item: any) => ({
            x: new Date(item.week).getTime(),
            y: parseInt(item.total_ratings)
          }))
      }
    ];

    // Comparison Matrix Scatter Chart
    this.comparisonMatrixSeries = [
      {
        name: 'Views vs Comments',
        data: this.analyticsData.comparisonMatrix
          .map((item: any) => ({
            x: parseInt(item.total_views),
            y: parseInt(item.total_comments),
            name: item.title
          }))
      }
    ];
  }

  groupHeatmapData(rawData: any[]) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days.map(day => {
      const dayData = rawData.find(d => d.day_of_week?.trim() === day);
      return {
        name: day.substring(0, 3),
        data: [{
          x: 'Comments',
          y: dayData ? parseInt(dayData.total_comments) : 0
        }]
      };
    });
  }
}