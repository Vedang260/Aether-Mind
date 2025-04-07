import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Comments } from "../entities/comments.entity";
import { CreateCommentDto } from "../dtos/createComment.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class CommentsRepository{
    constructor( 
        @InjectRepository(Comments)
        private readonly commentsRepository: Repository<Comments>){}

    async createComment(createCommentDto: CreateCommentDto): Promise<Comments | null>{
        try{
            const newComment = this.commentsRepository.create(createCommentDto);
            return await this.commentsRepository.save(newComment);
        }catch(error){
            console.error('Error in creating comment: ', error.message);
            throw new InternalServerErrorException('Error in creating a comment');
        }
    }

    async updateComment(comment_id: string, content: string): Promise<boolean>{
        try{
            const updateResult = await this.commentsRepository.update(comment_id, { content });
            return (updateResult.affected && updateResult.affected > 0 ? true : false)
        }catch(error){
            console.error('Error in updating comment: ', error.message);
            throw new InternalServerErrorException('Error in updating comment');
        }
    }

    async getComment(comment_id: string): Promise<Comments | null>{
        try{
            return await this.commentsRepository.findOne({ where: {comment_id } });
        }catch(error){
            console.error('Error in fetching the comment: ', error.message);
            throw new InternalServerErrorException('Error in fetching the comment');
        }
    }

    async getAllCommentsForArticle(article_id: string): Promise<Comments[]>{
        try{
            const comments = await this.commentsRepository
            .createQueryBuilder('comments')
            .leftJoinAndSelect('comments.user', 'user')
            .where('comments.article_id = :articleId', { articleId: article_id })
            .select([
                'comments.comment_id',
                'comments.content',
                'comments.created_at',
                'user.username',
            ])
            .getMany();
            return comments;
        }catch(error){
            console.error('Error in fetching the comments: ', error.message);
            throw new InternalServerErrorException('Error in fetching the comments');
        }
    }

    async deleteComment(comment_id: string): Promise<boolean>{
        try{
            const res = await this.commentsRepository.delete(comment_id);
            return (res.affected  && res.affected > 0 ? true : false); 
        }catch(error){
            console.error('Error in deleting a comment: ', error.message);
            throw new InternalServerErrorException('Error in deleting a comment: ');
        }
    }
}