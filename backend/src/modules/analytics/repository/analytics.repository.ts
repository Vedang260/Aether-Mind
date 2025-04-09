import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { DataSource, getRepository } from "typeorm";
import { DashboardAnalyticsDto } from "../dtos/dashboardAnalytics.dto";
import { Category } from "src/common/enums/category.enum";

@Injectable()
export class AnalyticsRepository{
    constructor(private readonly dataSource: DataSource) {}

    async getAdminDashboardStats(): Promise<DashboardAnalyticsDto> {
        try {
            const result = await this.dataSource.query(`
                SELECT
                    (SELECT COUNT(*) FROM articles) AS "totalArticles",
                    (SELECT COALESCE(SUM(views), 0) FROM articles) AS "totalViews",
                    (SELECT COUNT(*) FROM categories) AS "totalCategories",
                    (SELECT COUNT(*) FROM comments) AS "totalComments",
                    (SELECT COUNT(*) FROM ratings) AS "totalRatings",
                    (SELECT COUNT(*) FROM "user") AS "totalUsers"
            `);

            const stats = result[0];

            return {
                totalArticles: Number(stats.totalArticles),
                totalViews: Number(stats.totalViews),
                totalCategories: Number(stats.totalCategories),
                totalComments: Number(stats.totalComments),
                totalRatings: Number(stats.totalRatings),
                totalUsers: Number(stats.totalUsers),
            };
        } catch (error) {
            console.error('Error in fetching analytics stats:', error.message);
            throw new InternalServerErrorException('Error in fetching analytics stats');
        }
    }

    async getAnalyticsDashboard() {
        try{
            const result = await this.dataSource.query(`
                -- 📊 Category Wise Article Count
                SELECT
                    c.category_id,
                    c.name,
                    COUNT(a.article_id) AS article_count
                FROM categories c
                LEFT JOIN articles a ON c.category_id = a.category_id
                GROUP BY c.category_id, c.name
                ORDER BY article_count DESC;`);
            const [
                articleCounts
            ] = result;
            return {
                articleCounts
            }
        }catch(error){
            console.error('Error fetching category analytics:', error.message);
            throw new InternalServerErrorException('Error fetching category analytics');
        }
    }
}