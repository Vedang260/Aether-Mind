import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { elasticSearchConfig } from '../../config/elasticSearch.config';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  imports: [
    ElasticsearchModule.register(elasticSearchConfig),
  ],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [ElasticsearchModule, SearchService],
})
export class ElasticSearchCustomModule {}