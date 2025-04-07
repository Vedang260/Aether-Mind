import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { AIService } from "src/utils/AI/ai.service";
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CommentsRepository } from "../repositories/comments.repository";
import { CreateCommentDto } from "../dtos/createComment.dto";
import { Comments } from "../entities/comments.entity";

@Injectable()
export class CommentsService{
    constructor(
        private readonly commentsRepository: CommentsRepository,
    ){}

    async createComment(user_id: string, createCommentDto: Partial<CreateCommentDto>): Promise<{ success: boolean; message: string; comment: Comments | null}>{
        try{
            // Create a new object with author_id included, without modifying the original DTO
            const commentData = { ...createCommentDto, user_id } as CreateCommentDto;
            
            // Call your repository function with the new object
            const newComment = await this.commentsRepository.createComment(commentData);

            if(newComment){
                return {
                    success: true,
                    message: 'Your comment is added successfully',
                    comment: newComment
                }
            }
            return {
                success: false,
                message: 'Failed to create a new Comment',
                comment: null
            }
        }catch(error){
            console.error('Error in creating a new Comment: ', error.message);
            return {
                success: false,
                message: 'Failed to create a new comment',
                comment: null
            }
        }
    }

    // async updateArticle(article_id: string, updateArticleDto: Partial<UpdateArticleDto>): Promise<{success: boolean; message: string;}>{
    //     try{
    //         await this.articlesRepository.updateArticle(article_id, updateArticleDto);
    //         // Add to background processing queue
    //         await this.articleQueue.add({ article_id: article_id });
    //         return {
    //             success: true,
    //             message: 'Your article is updated successfully'
    //         }
    //     }catch(error){
    //         console.error('Error in updating the article: ', error.message);
    //         return {
    //             success: false,
    //             message: error.message
    //         }
    //     }
    // }

    // async deleteArticle(article_id: string): Promise<{success: boolean; message: string; }>{
    //     try{
    //         const res = await this.articlesRepository.deleteArticle(article_id);
    //         if(res){
    //             return {
    //                 success: true,
    //                 message: 'Article is deleted successfully'
    //             }
    //         }
    //         return{
    //             success: false,
    //             message: 'Failed to delete an article'
    //         }
    //     }catch(error){
    //         console.error('Error in deleting an article: ', error.message);
    //         return{
    //             success: false,
    //             message: error.message
    //         }
    //     }
    // }

    async getAllComments(article_id: string): Promise<{success: boolean; message: string; comments: Comments[] | null}> {
        try{
            const comments = await this.commentsRepository.getAllCommentsForArticle(article_id);
            return {
                success: true,
                message: 'All Comments are fetched',
                comments: comments
            }
        }catch(error){
            console.error('Error in fetching all comments:', error.message);
            throw new InternalServerErrorException('Error in fetching all comments');
        }
    }

   

}