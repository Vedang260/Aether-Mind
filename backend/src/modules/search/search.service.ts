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
        category: article.category?.name,
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
  // 🎯 Related Articles
  async getRelatedArticles(article: Articles, size = 5) {
    const { hits } = await this.elasticsearchService.search({
      index: this.index,
      size,
      query: {
        bool: {
          should: [
            {
              constant_score: {
                boost: 2,
                filter: {
                  more_like_this: {
                    fields: ['title^3', 'content', 'category^2'],
                    like: [{ _id: article.article_id.toString() }],
                    min_term_freq: 2,
                    max_query_terms: 25
                  }
                }
              }
            },
            {
              terms: {
                tags: article.tags,
                boost: 1.5
              }
            }
          ],
          minimum_should_match: 1,
          must_not: [
            { ids: { values: [article.article_id.toString()] } }
          ]
        }
      }
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
