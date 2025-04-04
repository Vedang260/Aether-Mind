import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ArticlesService } from "../services/articles.service";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt_auth.guard";
import { UploadService } from "src/utils/uploads/uploads.service";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('/articles')
@UseGuards(JwtAuthGuard)
export class ArticlesController{
    constructor(
        private readonly articlesService: ArticlesService,
        private uploadService: UploadService
    ){}

    @Post('upload-image')
    @UseInterceptors(FileInterceptor('image'))
    async uploadImage(@UploadedFile() file: Express.Multer.File){
        return await this.uploadService.uploadImage(file);
    }
}