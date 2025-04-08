import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Articles } from '../articles/entities/article.entity';

@Injectable()
export class SearchService {
  private readonly index = process.env.INDEX_ID as string;

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  // 🔍 Indexing
  async indexArticle(article: any) {
    await this.elasticsearchService.index({
      index: this.index,
      id: article.article_id.toString(),
      document: {
        article_id: article.article_id,
        image_url: article.image_url,
        author_id: article.author_id,
        title: article.title,
        description: article.description,
        content: article.content,
        tags: article.tags,
        category: article.category,
      },
    });
  }

  // 🔍 Full-text search
  async searchArticles(query: string) {
    const { hits } = await this.elasticsearchService.search({
      index: this.index,
      query: {
        multi_match: {
          query,
          fields: ['title', 'content', 'tags', 'category'],
        },
      },
    });

    return hits.hits.map(hit => hit._source);
  }

  // 🎯 Related Articles
  async getRelatedArticles(article: Articles, size = 5) {
    const { hits } = await this.elasticsearchService.search({
      index: this.index,
      size,
      query: {
        bool: {
          must: [
            {
              more_like_this: {
                fields: ['title', 'content', 'tags', 'category'],
                like: [
                  {
                    _id: article.article_id.toString(),
                  },
                ],
                min_term_freq: 1,
                max_query_terms: 12,
              },
            },
          ],
          must_not: [
            { match: { id: article.article_id } }, // Exclude current article
          ],
        },
      },
    });

    return hits.hits.map(hit => hit._source);
  }

  async removeFromIndex(articleId: string): Promise<void> {
    try {
      await this.elasticsearchService.delete({
        index: this.index,
        id: articleId,
      });
      console.log(`Article with ID ${articleId} removed from index.`);
    } catch (error) {
      if (error.meta?.body?.result === 'not_found') {
        console.warn(`Article with ID ${articleId} not found in index.`);
      } else {
        console.error('Error removing article from index:', error);
        throw error;
      }
    }
  }

}
