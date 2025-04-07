import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from '../services/comments.service';
import { CommentsRepository } from '../repositories/comments.repository';
import { Comments } from '../entities/comments.entity';
import { CommentsController } from '../controllers/comments.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comments]),
  ],
  controllers: [CommentsController],
  providers: [
    CommentsService,
    CommentsRepository
  ],
  exports: [CommentsService, CommentsRepository],
})
export class CommentsModule {} 