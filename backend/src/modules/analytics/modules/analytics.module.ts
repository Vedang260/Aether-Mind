import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsService } from '../service/analytics.service';
import { AnalyticsRepository } from '../repository/analytics.repository';
import { AnalyticsController } from '../controller/analytics.controller';

@Module({
  controllers: [AnalyticsController],
  providers: [
    AnalyticsService,
    AnalyticsRepository
  ],
  exports: [AnalyticsService, AnalyticsRepository],
})
export class AnalyticsModule {} 