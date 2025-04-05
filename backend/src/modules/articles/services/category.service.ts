import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { CategoryRepository } from "../repositories/category.repository";
import { CreateCategoryDto } from "../dtos/createCategory.dto";
import { Category } from "../entities/category.entity";

@Injectable()
export class CategoryService{
constructor(
        private readonly categoryRepository: CategoryRepository,
    ){}

    async createCategory(createArticleDto: CreateCategoryDto): Promise<{ success: boolean; message: string}>{
        try{            
            // Call your repository function with the new object
            const newCategory = await this.categoryRepository.createCategory(createArticleDto);

            if(newCategory){
                return {
                    success: true,
                    message: 'New Category is created successfully'
                }
            }
            return {
                success: false,
                message: 'Failed to create a new Category'
            }
        }catch(error){
            console.error('Error in creating a category ', error.message);
            return {
                success: false,
                message: 'Failed to create a category'
            }
        }
    }

    async updateCategory(category_id: string, name: string): Promise<{success: boolean; message: string;}>{
            try{
                await this.categoryRepository.updateCategory(category_id, name);
                return {
                    success: true,
                    message: 'Your category is updated successfully'
                }
            }catch(error){
                console.error('Error in updating the category: ', error.message);
                return {
                    success: false,
                    message: error.message
                }
            }
    }
    
    async deleteCategory(category_id: string): Promise<{success: boolean; message: string; }>{
        try{
            const res = await this.categoryRepository.deleteCategory(category_id);
            if(res){
                return {
                    success: true,
                    message: 'Category is deleted successfully'
                }
            }
            return{
                success: false,
                message: 'Failed to delete a category'
            }
        }catch(error){
            console.error('Error in deleting a category: ', error.message);
            return{
                success: false,
                message: error.message
            }
        }
    }

    async getAllCategories(): Promise<{success: boolean; message: string; categories: Category[] | null}> {
        try{
            const categories = await this.categoryRepository.getAllCategories();
            return {
                success: true,
                message: 'Explore our Categories',
                categories: categories
            }
        }catch(error){
            console.error('Error in fetching all categories:', error.message);
            throw new InternalServerErrorException('Error in fetching all categories');
        }
    }
}