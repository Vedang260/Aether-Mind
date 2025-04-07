interface Article {
    article_id: string;
    author_id: string;
    category_id: string;
    image_url: string;
    title: string;
    description: string;
    introduction: string;
    quote: string;
    did_you_know: string;
    content: string; 
    conclusion: string;
    summary: string;
    tags: string[];
    views: number;
    created_at: string;
    updated_at: string;
  }

export interface ApiResponse {
    success: boolean;
    message: string;
    articles: Article[];
  }