import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateRatingDto{
    @IsNotEmpty()
    @IsString()
    article_id: string;

    @IsNotEmpty()
    @IsString()
    user_id: string;

    @IsNotEmpty()
    @IsNumber()
    rating: number;
}