export interface Category{
    category_id: string;
    name: string;
}

export interface CategoryResponse{
    success: boolean;
    message: string;
    categories: Category[];
}