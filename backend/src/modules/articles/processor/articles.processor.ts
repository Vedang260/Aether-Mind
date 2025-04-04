import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { AIService } from '../../../utils/AI/ai.service';
import { NotFoundException } from '@nestjs/common';
import { ArticlesRepository } from '../repositories/articles.repository';
import { UpdateArticleDto } from '../dtos/updateArticle.dto';

@Processor('article-processing')
export class ArticleProcessor {
  constructor(
    private readonly aiService: AIService,
    private readonly articlesRepository: ArticlesRepository,
  ) {}

  @Process()
  async processArticle(job: Job<{ article_id: string }>) {
    try{
        const article = await this.articlesRepository.getArticle(job.data.article_id)
        if (!article) 
            throw new NotFoundException('Article is not found');

        // Generate  updated summary & tags
        article.summary = await this.aiService.generateSummary(article.content);
        //article.tags = await this.aiService.generateTags(article.content);

        const articleData = { ...article} as UpdateArticleDto;
        await this.articlesRepository.updateArticle(article.article_id, articleData);
    }catch(error){
        console.error('Error in article processing: ', error.message);
    }
  }
}