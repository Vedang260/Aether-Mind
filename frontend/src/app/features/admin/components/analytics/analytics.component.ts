import { Component, OnInit } from '@angular/core';
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
  ApexGrid,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { trigger, transition, style, animate } from '@angular/animations';
import { MatSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule, MatIconModule, MatSpinner],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css'],
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
export class AnalyticsComponent implements OnInit {
  timeRange = 'week';
  analyticsData: any;
  isLoading = false;

  // Chart Configurations
  articleCountChart: ApexChart = {
    type: 'bar',
    height: 350,
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
  articleCountSeries: ApexAxisChartSeries = [];

  viewsOverTimeChart: ApexChart = {
    type: 'area',
    height: 350,
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
  viewsOverTimeSeries: ApexAxisChartSeries = [];
  viewsOverTimeXAxis: ApexXAxis = { type: 'datetime' };

  commentHeatmapChart: ApexChart = {
    type: 'heatmap',
    height: 350,
    toolbar: { show: true }
  };
  commentHeatmapSeries: ApexAxisChartSeries = [];

  ratingChart: ApexChart = {
    type: 'radialBar',
    height: 350,
    toolbar: { show: false }
  };
  ratingSeries: ApexNonAxisChartSeries = [];
  ratingLabels: string[] = [];

  engagementChart: ApexChart = {
    type: 'line',
    height: 350,
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

  topArticlesChart: ApexChart = {
    type: 'bar',
    height: 350,
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
  topArticlesSeries: ApexAxisChartSeries = [];

  comparisonMatrixChart: ApexChart = {
    type: 'scatter',
    height: 350,
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

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.isLoading = true;
    this.analyticsService.getDashboardAnalytics().subscribe({
      next: (data) => {
        this.analyticsData = data.analytics;
        this.prepareCharts();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load analytics:', err);
        this.isLoading = false;
      }
    });
  }

  prepareCharts() {
    // Article Count Bar Chart
    this.articleCountSeries = [{
      name: 'Articles',
      data: this.analyticsData.articleCounts
        .filter((item: any) => parseInt(item.article_count) > 0)
        .map((item: any) => ({
          x: item.name,
          y: parseInt(item.article_count)
        }))
    }];

    // Views Over Time Area Chart
    this.viewsOverTimeSeries = [{
      name: 'Views',
      data: this.analyticsData.viewsOverTime
        .filter((item: any) => parseInt(item.total_views) > 0)
        .map((item: any) => ({
          x: new Date(item.week).getTime(),
          y: parseInt(item.total_views)
        }))
    }];

    // Comment Heatmap
    this.commentHeatmapSeries = this.groupHeatmapData(this.analyticsData.commentHeatmap);

    // Rating Distribution Radial Bar
    const ratingData = this.analyticsData.ratingDistribution
      .filter((item: any) => parseInt(item.rating_count) > 0);
    this.ratingSeries = ratingData.map((item: any) => 
      Math.round((parseInt(item.rating) / 5) * 100)
    );
    this.ratingLabels = ratingData.map((item: any) => `${item.name} (${item.rating}★)`);

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

    // Top Articles Bar Chart
    this.topArticlesSeries = [{
      name: 'Views',
      data: this.analyticsData.topArticles
        .filter((item: any) => item.views)
        .map((item: any) => ({
          x: item.title,
          y: parseInt(item.views)
        }))
    }];

    // Comparison Matrix Scatter Chart
    this.comparisonMatrixSeries = [
      {
        name: 'Views vs Comments',
        data: this.analyticsData.comparisonMatrix
          .filter((item: any) => parseInt(item.total_views) > 0 || parseInt(item.total_comments) > 0)
          .map((item: any) => ({
            x: parseInt(item.total_views),
            y: parseInt(item.total_comments),
            name: item.name
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

  setTimeRange(range: string) {
    this.timeRange = range;
    this.fetchData();
  }
}