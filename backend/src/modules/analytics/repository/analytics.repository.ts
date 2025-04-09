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
            const [articleCounts, viewsOverTime] = await Promise.all([
            this.dataSource.query(
                ` -- 📊 Category Wise Article Count
                    SELECT
                        c.category_id,
                        c.name,
                        COUNT(a.article_id) AS article_count
                    FROM categories c
                    LEFT JOIN articles a ON c.category_id = a.category_id
                    GROUP BY c.category_id, c.name
                    ORDER BY article_count DESC;
                `),
            this.dataSource.query(
                `-- 📈 Category Wise Views Over Time (weekly)
                    SELECT
                        c.category_id,
                        c.name,
                        DATE_TRUNC('week', a.created_at) AS week,
                        COALESCE(SUM(a.views), 0) AS total_views
                    FROM categories c
                    LEFT JOIN articles a ON c.category_id = a.category_id
                    GROUP BY c.category_id, c.name, week
                    ORDER BY week ASC;
                `),
            ]);
            return {
                articleCounts,
                viewsOverTime,
            }
        }catch(error){
            console.error('Error fetching category analytics:', error.message);
            throw new InternalServerErrorException('Error fetching category analytics');
        }
    }
}