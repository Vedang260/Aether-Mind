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
}