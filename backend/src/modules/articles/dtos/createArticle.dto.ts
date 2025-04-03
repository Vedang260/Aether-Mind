import { IsNotEmpty, IsString } from "class-validator";

export class CreateArticleDto{
    @IsNotEmpty()
    @IsString()
    category_id: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;
    
    @IsNotEmpty()
    @IsString()
    content: string;
}