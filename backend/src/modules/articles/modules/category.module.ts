import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { CategoryService } from '../services/category.service';
import { CategoryRepository } from '../repositories/category.repository';
import { CategoryController } from '../controllers/category.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
  ],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    CategoryRepository,
  ],
  exports: [CategoryService, CategoryRepository],
})
export class CategoryModule {} 