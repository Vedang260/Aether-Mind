import { Body, Controller, Delete, Get, Param, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt_auth.guard";
import { RolesGuard } from "src/modules/auth/guards/roles.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { UserRole } from "src/common/enums/roles.enum";
import { CommentsService } from "../services/comments.service";
import { CreateCommentDto } from "../dtos/createComment.dto";

@Controller('/comments')
@UseGuards(JwtAuthGuard)
export class CommentsController{
    constructor(
        private readonly commentsService: CommentsService
    ){}

    @Post('create')
    @UseGuards(RolesGuard)
    @Roles(UserRole.VIEWER)
    async createComment(@Req() req: Request, @Body('comment') comment: Partial<CreateCommentDto>){
        return await this.commentsService.createComment(req['user'].userId, comment);
    }

    // @Get(':id')
    // async getArticle(@Param('id') id: string){
    //     return await this.articlesService.getArticle(id);
    // }
    
    @Get(':id')
    async getAllComments(@Param('id') id: string){
        return await this.commentsService.getAllComments(id);
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