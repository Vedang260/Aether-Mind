import { Body, Controller, Delete, Get, Param, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt_auth.guard";
import { AnalyticsService } from "../service/analytics.service";
import { RolesGuard } from "src/modules/auth/guards/roles.guard";
import { UserRole } from "src/common/enums/roles.enum";
import { Roles } from "src/common/decorators/roles.decorator";

@Controller('/analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController{
    constructor(
        private readonly analyticsService: AnalyticsService,
    ){}

    @Get('categories-analytics')
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    async getCategoryAnalytics(){
        return await this.analyticsService.getAnalyticsDashboard();
    }

    @Get('admin-dashboard')
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    async getAllArticles(){
        return await this.analyticsService.adminDashboardAnalytics();
    }

    @Get('article-analytics/:id')
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    async getArticleAnalytics(@Param('id') id: string){
        return await this.analyticsService.getArticleAnalytics(id);
    }

}