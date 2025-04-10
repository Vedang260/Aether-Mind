import { Injectable } from "@nestjs/common";
import { AnalyticsRepository } from "../repository/analytics.repository";
import { DashboardAnalyticsDto } from "../dtos/dashboardAnalytics.dto";

@Injectable()
export class AnalyticsService{
    constructor(
        private readonly analyticsRepository: AnalyticsRepository,
    ){}

    async adminDashboardAnalytics(): Promise<{success: boolean; message: string; analytics: DashboardAnalyticsDto | null}>{
        try{
            const result = await this.analyticsRepository.getAdminDashboardStats();
            return {
                success: true,
                message: 'Dashboard Analytics are fetched successfully',
                analytics: result
            }
        }catch(error){
            console.error('Error in fetching the analytics: ', error.message);
            return {
                success: false,
                message: 'Failed to fetch the dashboard analytics',
                analytics: null
            }
        }
    }

    async getAnalyticsDashboard() {
        try{
            const result = await this.analyticsRepository.getAnalyticsDashboard();
            return {
                success: true,
                message: 'Dashboard Analytics are fetched successfully',
                analytics: result
            }
        }catch(error){
            console.error('Error in fetching the categorywise analytics: ', error.message);
            return {
                success: false,
                message: 'Failed to fetch the categorywise dashboard analytics',
                analytics: null
            }
        }
    }

    async getArticleAnalytics(article_id: string) {
        try{
            const result = await this.analyticsRepository.getArticleAnalytics(article_id);
            return {
                success: true,
                message: 'Article Analytics are fetched successfully',
                analytics: result
            }
        }catch(error){
            console.error('Error in fetching the article analytics: ', error.message);
            return {
                success: false,
                message: 'Failed to fetch the article analytics',
                analytics: null
            }
        }
    }
}