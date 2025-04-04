import { Controller, Post, UseGuards } from "@nestjs/common";
import { ArticlesService } from "../services/articles.service";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt_auth.guard";

@Controller('/articles')
@UseGuards(JwtAuthGuard)
export class ArticlesController{
    constructor(private readonly articlesService: ArticlesService){}

}