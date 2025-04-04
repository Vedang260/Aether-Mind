import { Body, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ArticlesService } from "../services/articles.service";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt_auth.guard";
import { UploadService } from "src/utils/uploads/uploads.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { RolesGuard } from "src/modules/auth/guards/roles.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { UserRole } from "src/common/enums/roles.enum";

@Controller('/articles')
@UseGuards(JwtAuthGuard)
export class ArticlesController{
    constructor(
        private readonly articlesService: ArticlesService,
        private uploadService: UploadService
    ){}

    @Post('upload-image')
    @UseInterceptors(FileInterceptor('image'))
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    async uploadImage(@UploadedFile() file: Express.Multer.File){
        return await this.uploadService.uploadImage(file);
    }

    @Post('generate')
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    async generateArticleFromImage(@Body() image_url: string){
        return await this.articlesService.generateArticleFromImage(image_url);
    }
}