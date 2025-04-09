export interface ArticleCounts{
    category_id: string;
    name: string;
    article_count: string
}

export interface CommentHeatMap{
    category_id: string,
    name: string,
    day_of_week: string,
    total_comments: string
}

export interface weeklyEngagement{
    category_id: string,
    name: string,
    week: string,
    total_comments: string,
    total_ratings: string,
}

export interface ratingDistribution{
    category_id: string,
    name: string,
    rating: number,
    rating_count: string 
}

export interface topArticles{
    category_id: string,
    category_name: string,
    article_id: string,
    title: string,
    views: number,
    created_at: string,
    rn: string,
    engagementData?: number[];
}