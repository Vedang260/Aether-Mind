import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Articles } from '../../articles/entities/article.entity';
import { ArticlesService } from '../../articles/services/articles.service';
import { ArticlesRepository } from '../repositories/articles.repository';
import { ArticlesController } from '../controllers/articles.controller';
import { AIService } from 'src/utils/AI/ai.service';
import { BullModule } from '@nestjs/bull';
import { UploadModule } from 'src/utils/uploads/uploads.module';
import { ArticleProcessor } from '../processor/articles.processor';
import { SearchService } from 'src/modules/search/search.service';
import { ElasticSearchCustomModule } from 'src/modules/search/search.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Articles]),
    BullModule.registerQueue({
        name: 'article-processing',
    }),
    UploadModule,
    ElasticSearchCustomModule
  ],
  controllers: [ArticlesController],
  providers: [
    ArticlesService,
    ArticlesRepository,
    ArticleProcessor,
    AIService
  ],
  exports: [ArticlesService, ArticlesRepository, AIService],
})
export class ArticlesModule {} 