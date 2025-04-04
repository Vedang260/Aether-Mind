import { Module } from '@nestjs/common';
import { CloudinaryProvider } from '../../config/cloudinary.config';
import { UploadService } from './uploads.service';

@Module({
  providers: [CloudinaryProvider, UploadService],
  exports: [UploadService],
})
export class UploadModule {}