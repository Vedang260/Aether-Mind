import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../../../../core/services/analytics.service';
import {
    ApexAxisChartSeries,
    ApexChart,
    ApexNonAxisChartSeries,
    ApexXAxis,
    ChartComponent,
    NgApexchartsModule
  } from 'ng-apexcharts';
import { ArticleCounts, CommentHeatMap, weeklyEngagement, ratingDistribution, topArticles } from '../../../../shared/models/analytics.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NgApexchartsModule,
    ChartComponent
  ],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})

export class AnalyticsComponent implements OnInit {
  timeRange = 'week';
  analyticsData: any;

  // Chart Configs
  // Add missing properties to your chart configs
  articleCountChart: ApexChart = {
    type: 'treemap',
    height: 300,
    toolbar: { show: false }
  };
  
  engagementChart: ApexChart = {
    type: 'line',
    height: 300,
    toolbar: { show: false }
  };
  
  ratingChart: ApexChart = {
    type: 'radialBar',
    height: 300
  };
  
  heatmapChart: ApexChart = {
    type: 'heatmap',
    height: 300
  };
  
  
  articleCountSeries: ApexAxisChartSeries = [];

  
  engagementSeries: ApexAxisChartSeries = [];
  engagementXAxis: ApexXAxis = { type: 'datetime' };

  
  ratingSeries: ApexNonAxisChartSeries = [];
  ratingLabels: string[] = [];

  
  heatmapSeries: ApexAxisChartSeries = [];

  topArticles: topArticles[] = [];
  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.analyticsService.getDashboardAnalytics().subscribe({
      next: (data) => {
        this.analyticsData = data.analytics;
        this.prepareCharts();
      },
      error: (err) => console.error('Failed to load analytics:', err)
    });
  }

  prepareCharts() {
    // Article Count Treemap
    this.articleCountSeries = [{
        data: (this.analyticsData.articleCounts || [])
          .filter((item: ArticleCounts) => parseInt(item.article_count) > 0)
          .map((item: ArticleCounts) => ({
            x: item.name,
            y: parseInt(item.article_count)
          }))
      }];
    // Engagement Trend
    this.engagementSeries = [
      {
        name: 'Comments',
        data: this.analyticsData.weeklyEngagement
          .filter((item: weeklyEngagement) => parseInt(item.total_comments) > 0)
          .map((item: weeklyEngagement) => ({
            x: new Date(item.week).getTime(),
            y: parseInt(item.total_comments)
          }))
      },
      {
        name: 'Ratings',
        data: this.analyticsData.weeklyEngagement
          .filter((item: weeklyEngagement) => parseInt(item.total_ratings) > 0)
          .map((item: weeklyEngagement) => ({
            x: new Date(item.week).getTime(),
            y: parseInt(item.total_ratings)
          }))
      }
    ];

    // Rating Distribution
    const ratingData = this.analyticsData.ratingDistribution
      .filter((item: ratingDistribution) => parseInt(item.rating_count) > 0);
    this.ratingSeries = ratingData.map((item: ratingDistribution) => 
      Math.round((item.rating / 5) * 100)
    );
    this.ratingLabels = ratingData.map((item: ratingDistribution) => item.name);

    // Heatmap
    this.heatmapSeries = this.groupHeatmapData(
      this.analyticsData.commentHeatmap
    );

    // Top Articles
    this.topArticles = this.analyticsData.topArticles?.map((article: any) => ({
        title: article.title,
        views: article.views,
        engagementData: article?.engagementData || [30,40,35,50,49,60] // Default fallback
      })) || [];
  
  
  }

  groupHeatmapData(rawData: CommentHeatMap[]) {
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

  getEngagementDataForArticle(articleId: string): number[] {
    // 🚀 Optional: Map your real data if you have any
    return [30, 40, 35, 50, 49, 60]; // Dummy static data, or fetch from your analyticsData if available
  }
}