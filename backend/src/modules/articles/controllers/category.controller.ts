import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt_auth.guard";
import { RolesGuard } from "src/modules/auth/guards/roles.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { UserRole } from "src/common/enums/roles.enum";
import { CategoryService } from "../services/category.service";
import { CreateCategoryDto } from "../dtos/createCategory.dto";

@Controller('/category')
@UseGuards(JwtAuthGuard)
export class CategoryController{
    constructor(
        private readonly categoryService: CategoryService,
    ){}

    @Post('create')
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    async createCategory(@Body() category: CreateCategoryDto){
        return await this.categoryService.createCategory(category);
    }

    @Get()
    async getAllCategories(){
        return await this.categoryService.getAllCategories();
    }

    @Put(':id')
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    async updateCategory(@Param('id') id: string, @Body('name') name: string){
        return await this.categoryService.updateCategory(id, name);
    }

    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    async deleteCategory(@Param('id') id: string){
        return await this.categoryService.deleteCategory(id);
    }
}