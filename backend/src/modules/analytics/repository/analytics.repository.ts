import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { DataSource } from "typeorm";

@Injectable()
export class AnalyticsRepository{
    constructor(private readonly dataSource: DataSource) {}

    async getAdminDashboardStats(): Promise<{
        totalArticles: number;
        totalViews: number;
        totalCategories: number;
        totalComments: number;
        totalRatings: number;
        totalUsers: number;
    }> {
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
}