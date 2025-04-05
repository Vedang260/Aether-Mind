import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ArticlesRepository } from "../repositories/articles.repository";
import { CreateArticleDto } from "../dtos/createArticle.dto";
import { UpdateArticleDto } from "../dtos/updateArticle.dto";
import { Articles } from "../entities/article.entity";
import { AIService } from "src/utils/AI/ai.service";
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class ArticlesService{
    constructor(
        private readonly articlesRepository: ArticlesRepository,
        private readonly aiService: AIService,
        @InjectQueue('article-processing') private articleQueue: Queue,
    ){}

    async createArticle(author_id: string, createArticleDto: Partial<CreateArticleDto>): Promise<{ success: boolean; message: string}>{
        try{
            // Create a new object with author_id included, without modifying the original DTO
            const articleData = { ...createArticleDto, author_id } as CreateArticleDto;
            
            // Call your repository function with the new object
            const newArticle = await this.articlesRepository.createArticle(articleData);

            if(newArticle){
                // Add to background processing queue
                await this.articleQueue.add({ article_id: newArticle.article_id });
                return {
                    success: true,
                    message: 'New Article is created successfully'
                }
            }
            return {
                success: false,
                message: 'Failed to create a new Aricle'
            }
        }catch(error){
            console.error('Error in creating an article: ', error.message);
            return {
                success: false,
                message: 'Failed to create an article'
            }
        }
    }

    async updateArticle(article_id: string, updateArticleDto: Partial<UpdateArticleDto>): Promise<{success: boolean; message: string;}>{
        try{
            await this.articlesRepository.updateArticle(article_id, updateArticleDto);
            // Add to background processing queue
            await this.articleQueue.add({ article_id: article_id });
            return {
                success: true,
                message: 'Your article is updated successfully'
            }
        }catch(error){
            console.error('Error in updating the article: ', error.message);
            return {
                success: false,
                message: error.message
            }
        }
    }

    async deleteArticle(article_id: string): Promise<{success: boolean; message: string; }>{
        try{
            const res = await this.articlesRepository.deleteArticle(article_id);
            if(res){
                return {
                    success: true,
                    message: 'Article is deleted successfully'
                }
            }
            return{
                success: false,
                message: 'Failed to delete an article'
            }
        }catch(error){
            console.error('Error in deleting an article: ', error.message);
            return{
                success: false,
                message: error.message
            }
        }
    }

    async getAllArticles(): Promise<{success: boolean; message: string; articles: Articles[] | null}> {
        try{
            const articles = await this.articlesRepository.getAllArticles();
            return {
                success: true,
                message: 'Explore our Articles',
                articles: articles
            }
        }catch(error){
            console.error('Error in fetching all articles:', error.message);
            throw new InternalServerErrorException('Error in fetching all articles');
        }
    }

    async getArticle(article_id: string): Promise<{ success: boolean; message: string; article: Articles | null}>{
        try{
            const article = await this.articlesRepository.getArticle(article_id);
            return{
                success: true,
                message: 'Start reading your Article',
                article: article
            }
        }catch(error){
            console.error('Error in fetching an article: ', error.message);
            return{
                success: false,
                message: 'Failed to fetch the article',
                article: null
            }
        }
    }

    async generateArticleFromImage(image_url: string): Promise<{ success: boolean; message: string; article: any}>{
        try{
            const response = await this.aiService.generateArticleFromImage(image_url);
            return {
                success: true,
                message: 'Your AI-article is generated',
                article: response
            }
        }catch(error){
            console.error('Error in generating an Article from Image using AI: ', error.message);
            return {
                success: false,
                message: 'Your AI-article is generated',
                article: null
            }
        }
    }
}