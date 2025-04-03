import { IsNotEmpty, IsString } from "class-validator";

export class CreateCatgeoryDto{
    @IsNotEmpty()
    @IsString()
    name: string;
}