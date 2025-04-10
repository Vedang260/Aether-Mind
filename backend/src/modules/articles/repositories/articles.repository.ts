import { InjectRepository } from "@nestjs/typeorm";
import { Articles } from "../entities/article.entity";
import { DataSource, Repository } from "typeorm";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { CreateArticleDto } from "../dtos/createArticle.dto";
import { UpdateArticleDto } from "../dtos/updateArticle.dto";

@Injectable()
export class ArticlesRepository{
    constructor( 
        @InjectRepository(Articles)
        private readonly articlesRepository: Repository<Articles>,
        private readonly dataSource: DataSource
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

    async updateArticle(article_id: string, updateArticleDto: Partial<UpdateArticleDto>): Promise<boolean>{
        try{
            const updateResult = await this.articlesRepository.update(article_id, updateArticleDto);
            return (updateResult.affected && updateResult.affected > 0 ? true : false)
        }catch(error){
            console.error('Error in updating an article: ', error.message);
            throw new InternalServerErrorException('Error in updating an article');
        }
    }

    async getArticle(article_id: string): Promise<Articles | null>{
        try{
            // updates the view count whenever any user viewes any particular article
            await this.updateViewCount(article_id);
            return await this.articlesRepository.findOne({ where: {article_id }, relations: ['category'] });

        }catch(error){
            console.error('Error in fetching an article: ', error.message);
            throw new InternalServerErrorException('Error in fetching an article');
        }
    }

    async getAllArticles(): Promise<Articles[]>{
        try{
            return await this.articlesRepository.find({ relations: ['category']});
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

    async updateViewCount(article_id: string): Promise<boolean>{
        try{
            await this.articlesRepository.increment({ article_id }, 'views', 1);
            return true;
        }catch(error){
            console.error('Error in updating view count: ', error.message);
            throw new InternalServerErrorException('Error in updating view count: ');   
        }
    }

    async getRelatedArticles(article_id: string){
        try{
            const relatedArticles = await this.dataSource.query(
                `SELECT a.*
                 FROM articles a
                 WHERE a.category_id = (
                     SELECT category_id
                     FROM articles
                     WHERE article_id = $1
                 )
                 AND a.article_id != $1
                 ORDER BY a.created_at DESC
                 LIMIT 4;`,
                [article_id]
            );
    
            return relatedArticles;
        }catch(error){
            console.error('Error in fetching related articles: ', error.message);
            throw new InternalServerErrorException('Error in fetching related articles: ');   
        }
    }
}