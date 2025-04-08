import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ratings } from '../entities/ratings.entity';
import { RatingsController } from '../controllers/ratings.controller';
import { RatingsService } from '../services/ratings.service';
import { RatingsRepository } from '../repositories/ratings.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ratings]),
  ],
  controllers: [RatingsController],
  providers: [
    RatingsService,
    RatingsRepository
  ],
  exports: [RatingsService, RatingsRepository],
})
export class RatingsModule {} 