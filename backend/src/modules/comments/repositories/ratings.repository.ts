import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Comments } from "../entities/comments.entity";
import { CreateCommentDto } from "../dtos/createComment.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Ratings } from "../entities/ratings.entity";
import { CreateRatingDto } from "../dtos/createRating.dto";

@Injectable()
export class RatingsRepository{
    constructor( 
        @InjectRepository(Comments)
        private readonly ratingsRepository: Repository<Ratings>){}

    async createRatings(createRatingDto: CreateRatingDto): Promise<Ratings | null>{
        try{
            const newRating = this.ratingsRepository.create(createRatingDto);
            return await this.ratingsRepository.save(newRating);
        }catch(error){
            console.error('Error in creating rating: ', error.message);
            throw new InternalServerErrorException('Error in creating a rating');
        }
    }

    async getRatings(article_id: string, user_id: string): Promise<Ratings | null>{
        try{
            return await this.ratingsRepository.findOne({ where: {article_id, user_id } });
        }catch(error){
            console.error('Error in fetching the rating: ', error.message);
            throw new InternalServerErrorException('Error in fetching the rating');
        }
    }

    // async getAllCommentsForArticle(article_id: string): Promise<Comments[]>{
    //     try{
    //         const comments = await this.commentsRepository
    //         .createQueryBuilder('comments')
    //         .leftJoinAndSelect('comments.user', 'user')
    //         .where('comments.article_id = :articleId', { articleId: article_id })
    //         .select([
    //             'comments.comment_id',
    //             'comments.content',
    //             'comments.created_at',
    //             'user.username',
    //         ])
    //         .getMany();
    //         return comments;
    //     }catch(error){
    //         console.error('Error in fetching the comments: ', error.message);
    //         throw new InternalServerErrorException('Error in fetching the comments');
    //     }
    // }

}