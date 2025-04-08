import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { CreateCommentDto } from "../dtos/createComment.dto";
import { Comments } from "../entities/comments.entity";
import { RatingsRepository } from "../repositories/ratings.repository";
import { CreateRatingDto } from "../dtos/createRating.dto";
import { Ratings } from "../entities/ratings.entity";

@Injectable()
export class RatingsService{
    constructor(
        private readonly ratingsRepository: RatingsRepository,
    ){}

    async createRating(user_id: string, createRatingDto: Partial<CreateRatingDto>): Promise<{ success: boolean; message: string; rating: number | null}>{
        try{
            // Create a new object with user_id included, without modifying the original DTO
            const ratingData = { ...createRatingDto, user_id } as CreateRatingDto;
            
            // Call your repository function with the new object
            const newRating = await this.ratingsRepository.createRatings(ratingData);

            if(newRating){
                return {
                    success: true,
                    message: 'Your rating is added successfully',
                    rating: newRating.rating
                }
            }
            return {
                success: false,
                message: 'Failed to create a new Rating',
                rating: null
            }
        }catch(error){
            console.error('Error in creating a new Rating: ', error.message);
            return {
                success: false,
                message: 'Failed to create a new rating',
                rating: null
            }
        }
    }

    async getRating(user_id: string, article_id: string): Promise<{ success: boolean; message: string; rating: number | null}>{
        try{
            const rating = await this.ratingsRepository.getRatings(article_id, user_id);
            if(rating){
                return {
                    success: true,
                    message: 'Your rating is fetched successfully',
                    rating: rating.rating
                }
            }
            return {
                success: true,
                message: 'Your havenot rated yet',
                rating: null
            }
        }catch(error){
            console.error('Error in fetching a Rating: ', error.message);
            return {
                success: false,
                message: 'Failed to fetch a rating',
                rating: null
            }
        }
    }
}