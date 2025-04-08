import { Body, Controller, Delete, Get, Param, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt_auth.guard";
import { RolesGuard } from "src/modules/auth/guards/roles.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { UserRole } from "src/common/enums/roles.enum";
import { CreateCommentDto } from "../dtos/createComment.dto";
import { RatingsService } from "../services/ratings.service";

@Controller('/ratings')
@UseGuards(JwtAuthGuard)
export class RatingsController{
    constructor(
        private readonly ratingsService: RatingsService
    ){}

    @Post('create')
    @UseGuards(RolesGuard)
    @Roles(UserRole.VIEWER)
    async createRating(@Req() req: Request, @Body('rating') rating: Partial<CreateCommentDto>){
        return await this.ratingsService.createRating(req['user'].userId, rating);
    }

    // @Get(':id')
    // async getArticle(@Param('id') id: string){
    //     return await this.articlesService.getArticle(id);
    // }
    
    @Get(':id')
    async getRating(@Param('id') id: string, @Req() req: Request){
        return await this.ratingsService.getRating(req['user'].userId, id);
    }

    // @Put(':id')
    // @UseGuards(RolesGuard)
    // @Roles(UserRole.ADMIN, UserRole.EDITOR)
    // async updateArticle(@Param('id') id: string, @Body() article: Partial<UpdateArticleDto>){
    //     return await this.articlesService.updateArticle(id, article);
    // }

    // @Delete(':id')
    // @UseGuards(RolesGuard)
    // @Roles(UserRole.ADMIN)
    // async deleteArticle(@Param('id') id: string){
    //     return await this.articlesService.deleteArticle(id);
    // }
}