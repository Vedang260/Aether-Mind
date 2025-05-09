import { Body, Controller, Delete, Get, Param, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ArticlesService } from "../services/articles.service";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt_auth.guard";
import { UploadService } from "src/utils/uploads/uploads.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { RolesGuard } from "src/modules/auth/guards/roles.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { UserRole } from "src/common/enums/roles.enum";
import { CreateArticleDto } from "../dtos/createArticle.dto";
import { UpdateArticleDto } from "../dtos/updateArticle.dto";
import { SearchService } from "src/modules/search/search.service";

@Controller('/articles')
@UseGuards(JwtAuthGuard)
export class ArticlesController{
    constructor(
        private readonly articlesService: ArticlesService,
        private uploadService: UploadService,
        private searchService: SearchService
    ){}

    @Post('upload-image')
    @UseInterceptors(FileInterceptor('image'))
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.EDITOR)
    async uploadImage(@UploadedFile() file: Express.Multer.File){
        return await this.uploadService.uploadFile(file);
    }

    @Post('generate')
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.EDITOR)
    async generateArticleFromImage(@Body('image_url') image_url: string){
        return await this.articlesService.generateArticleFromImage(image_url);
    }

    @Post('create')
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.EDITOR)
    async createArticle(@Req() req: Request, @Body() article: Partial<CreateArticleDto>){
        return await this.articlesService.createArticle(req['user'].userId, article);
    }

    @Get(':id')
    async getArticle(@Param('id') id: string){
        return await this.articlesService.getArticle(id);
    }
    
    @Get()
    async getAllArticles(){
        return await this.articlesService.getAllArticles();
    }

    @Put(':id')
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.EDITOR)
    async updateArticle(@Param('id') id: string, @Body() article: Partial<UpdateArticleDto>){
        return await this.articlesService.updateArticle(id, article);
    }

    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    async deleteArticle(@Param('id') id: string){
        return await this.articlesService.deleteArticle(id);
    }

    @Get(':id/related')
    async getRelated(@Param('id') id: string) {
        return await this.articlesService.getRelatedArticles(id);
    }
}