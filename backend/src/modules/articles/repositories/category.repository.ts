import { Repository } from "typeorm";
import { Category } from "../entities/category.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { CreateCategoryDto } from "../dtos/createCategory.dto";

@Injectable()
export class CategoryRepository{
    constructor( 
            @InjectRepository(Category)
            private readonly categoryRepository: Repository<Category>
        ){}
    
    async createArticle(createCategoryDto: CreateCategoryDto): Promise<Category | null>{
        try{
            const newCategory = this.categoryRepository.create(createCategoryDto);
            return await this.categoryRepository.save(newCategory);
        }catch(error){
            console.error('Error in creating a new Category: ', error.message);
            throw new InternalServerErrorException('Error in creating a new Category');
        }
    }
        
    async updateCategory(category_id: string, name: string): Promise<boolean>{
        try{
            const updateResult = await this.categoryRepository.update(category_id, {name});
            return (updateResult.affected && updateResult.affected > 0 ? true : false)
        }catch(error){
            console.error('Error in updating a category: ', error.message);
            throw new InternalServerErrorException('Error in updating a category');
        }
    }
        
    async getCategory(category_id: string): Promise<Category | null>{
        try{
            return await this.categoryRepository.findOne({ where: {category_id } });
        }catch(error){
            console.error('Error in fetching a category: ', error.message);
            throw new InternalServerErrorException('Error in fetching a category');
        }
    }
        
    async getAllCategories(): Promise<Category[]>{
        try{
            return await this.categoryRepository.find();
        }catch(error){
            console.error('Error in fetching the categories: ', error.message);
            throw new InternalServerErrorException('Error in fetching the categories');
        }
    }
        
    async deleteCategory(category_id: string): Promise<boolean>{
        try{
            const res = await this.categoryRepository.delete(category_id);
            return (res.affected  && res.affected > 0 ? true : false); 
        }catch(error){
            console.error('Error in deleting a category: ', error.message);
            throw new InternalServerErrorException('Error in deleting a category: ');
        }
    }
}