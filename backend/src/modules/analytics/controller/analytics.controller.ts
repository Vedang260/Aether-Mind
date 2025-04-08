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

    @Get()
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    async getAllArticles(){
        return await this.analyticsService.adminDashboardAnalytics();
    }
}