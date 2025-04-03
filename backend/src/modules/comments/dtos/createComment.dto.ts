import { IsNotEmpty, IsString } from "class-validator";

export class CreateCommentDto{
    @IsNotEmpty()
    @IsString()
    article_id: string;

    @IsString()
    @IsNotEmpty()
    user_id: string;

    @IsString()
    @IsNotEmpty()
    content: string;
}