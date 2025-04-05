import { IsNotEmpty, IsString } from "class-validator";

export class CreateArticleDto{
    @IsNotEmpty()
    @IsString()
    author_id: string;

    @IsNotEmpty()
    @IsString()
    category_id: string;

    @IsString()
    @IsNotEmpty()
    image_url: string;
    
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;
    
    @IsNotEmpty()
    @IsString()
    introduction: string;

    @IsNotEmpty()
    @IsString()
    content: string;

    @IsNotEmpty()
    @IsString()
    conclusion: string;
}