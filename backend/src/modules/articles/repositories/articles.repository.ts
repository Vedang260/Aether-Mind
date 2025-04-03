import { InjectRepository } from "@nestjs/typeorm";
import { Articles } from "../entities/article.entity";
import { Repository } from "typeorm";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { CreateArticleDto } from "../dtos/createArticle.dto";

@Injectable()
export class ArticlesRepository{
    constructor( 
        @InjectRepository(Articles)
        private readonly articlesRepository: Repository<Articles>
    ){}

    async createArticle(createArticleDto: CreateArticleDto): Promise<Articles | null>{
        try{
            const newArticle = this.articlesRepository.create(createArticleDto);
            return await this.articlesRepository.save(newArticle);
        }catch(error){
            console.error('Error in creating an article: ', error.message);
            throw new InternalServerErrorException('Error in creating an article');
        }
    }

    async updateArticle(article_id: string, content: string, summary: string, tags: string[]): Promise<boolean>{
        try{
            const updateResult = await this.articlesRepository.update(article_id, { content, summary, tags });
            return (updateResult.affected && updateResult.affected > 0 ? true : false)
        }catch(error){
            console.error('Error in updating an article: ', error.message);
            throw new InternalServerErrorException('Error in updating an article');
        }
    }

    async getArticle(article_id: string): Promise<Articles | null>{
        try{
            return await this.articlesRepository.findOne({ where: {article_id } });
        }catch(error){
            console.error('Error in fetching an article: ', error.message);
            throw new InternalServerErrorException('Error in fetching an article');
        }
    }

    async getAllArticles(): Promise<Articles[]>{
        try{
            return await this.articlesRepository.find();
        }catch(error){
            console.error('Error in fetching the articles: ', error.message);
            throw new InternalServerErrorException('Error in fetching the articles');
        }
    }

    async deleteArticle(article_id: string): Promise<boolean>{
        try{
            const res = await this.articlesRepository.delete(article_id);
            return (res.affected  && res.affected > 0 ? true : false); 
        }catch(error){
            console.error('Error in deleting an article: ', error.message);
            throw new InternalServerErrorException('Error in deleting an article: ');
        }
    }
}