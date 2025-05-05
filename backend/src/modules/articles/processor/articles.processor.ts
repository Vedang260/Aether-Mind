import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { AIService } from '../../../utils/AI/ai.service';
import { NotFoundException } from '@nestjs/common';
import { ArticlesRepository } from '../repositories/articles.repository';
import { UpdateArticleDto } from '../dtos/updateArticle.dto';
import { SearchService } from 'src/modules/search/search.service';

@Processor('article-processing')
export class ArticleProcessor {
  
  constructor(
    private readonly aiService: AIService,
    private readonly articlesRepository: ArticlesRepository,
    private readonly searchService: SearchService
  ) {}

  @Process()
  async processArticle(job: Job<{ article_id: string }>) {
    try{
        const article = await this.articlesRepository.getArticle(job.data.article_id)
        if (!article) 
            throw new NotFoundException('Article is not found');

        const longContext = article.introduction + article.description + article.content + article.did_you_know + article.conclusion;

        // Generate  updated summary
        article.summary = await this.aiService.generateSummary(longContext);
        // Generate Context Aware Summaries
        
        const articleData = { ...article} as UpdateArticleDto;
        await this.articlesRepository.updateArticle(article.article_id, articleData);
        await this.searchService.indexArticle(articleData);

        // Generate tags
        article.tags = await this.aiService.generateTags(article.content);

        const articleData2 = { ...article} as UpdateArticleDto;
        await this.articlesRepository.updateArticle(article.article_id, articleData2);
        await this.searchService.indexArticle(articleData2);
    }catch(error){
        console.error('Error in article processing: ', error.message);
    }
  }
}