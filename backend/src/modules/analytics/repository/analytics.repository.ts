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
            const [articleCounts, viewsOverTime, commentHeatmap, ratingDistribution, weeklyEngagement, topArticles, comparisonMatrix] = await Promise.all([
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
                this.dataSource.query(
                    `SELECT
                        c.category_id,
                        c.name,
                        TO_CHAR(cm.created_at, 'Day') AS day_of_week,
                        COUNT(cm.comment_id) AS total_comments
                    FROM categories c
                    LEFT JOIN articles a ON c.category_id = a.category_id
                    LEFT JOIN comments cm ON a.article_id = cm.article_id
                    GROUP BY c.category_id, c.name, day_of_week
                    ORDER BY day_of_week ASC;
                    `),
                this.dataSource.query(
                                `SELECT
                        c.category_id,
                        c.name,
                        r.rating AS rating,
                        COUNT(r.rating_id) AS rating_count
                    FROM categories c
                    LEFT JOIN articles a ON c.category_id = a.category_id
                    LEFT JOIN ratings r ON a.article_id = r.article_id
                    GROUP BY c.category_id, c.name, rating
                    ORDER BY rating DESC;
                    `),
                this.dataSource.query(
                `-- 📅 Weekly Engagement (comments vs ratings)
                    SELECT
                        c.category_id,
                        c.name,
                        DATE_TRUNC('week', COALESCE(cm.created_at, r.created_at)) AS week,
                        COUNT(DISTINCT cm.comment_id) AS total_comments,
                        COUNT(DISTINCT r.rating_id) AS total_ratings
                    FROM categories c
                    LEFT JOIN articles a ON c.category_id = a.category_id
                    LEFT JOIN comments cm ON a.article_id = cm.article_id
                    LEFT JOIN ratings r ON a.article_id = r.article_id
                    GROUP BY c.category_id, c.name, week
                    ORDER BY week ASC;
                    `),
                this.dataSource.query(
                    ` -- 🏆 Top Articles Per Category
                    SELECT *
                    FROM (
                        SELECT
                            c.category_id,
                            c.name AS category_name,
                            a.article_id,
                            a.title,
                            a.views,
                            a.created_at,
                            ROW_NUMBER() OVER (PARTITION BY c.category_id ORDER BY a.views DESC) AS rn
                        FROM categories c
                        LEFT JOIN articles a ON c.category_id = a.category_id
                        ORDER BY a.views
                    ) sub
                    WHERE rn = 1;
                    `),
                    this.dataSource.query(
                        ` -- 🌐 Comparison Matrix (views vs comments vs ratings)
                   SELECT
                        c.category_id,
                        c.name,
                        COALESCE(SUM(article_data.views), 0) AS total_views,
                        COALESCE(SUM(article_data.total_comments), 0) AS total_comments,
                        COALESCE(SUM(article_data.total_ratings), 0) AS total_ratings
                    FROM categories c
                    LEFT JOIN (
                        SELECT
                            a.category_id,
                            a.article_id,
                            a.views,
                            COUNT(DISTINCT cm.comment_id) AS total_comments,
                            COUNT(DISTINCT r.rating_id) AS total_ratings
                        FROM articles a
                        LEFT JOIN comments cm ON a.article_id = cm.article_id
                        LEFT JOIN ratings r ON a.article_id = r.article_id
                        GROUP BY a.category_id, a.article_id, a.views
                    ) AS article_data ON c.category_id = article_data.category_id
                    GROUP BY c.category_id, c.name
                    ORDER BY total_views DESC;
                        `),
            ]);
            return {
                articleCounts,
                viewsOverTime,
                commentHeatmap,
                ratingDistribution,
                weeklyEngagement,
                topArticles,
                comparisonMatrix
            }
        }catch(error){
            console.error('Error fetching category analytics:', error.message);
            throw new InternalServerErrorException('Error fetching category analytics');
        }
    }
}