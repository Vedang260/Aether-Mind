import { IsNotEmpty, IsString } from "class-validator";
import { CreateArticleDto } from "./createArticle.dto";

export class UpdateArticleDto extends CreateArticleDto{
    @IsString()
    @IsNotEmpty()
    summary: string;

    @IsNotEmpty()
    tags: string[]
}