// src/config/queue.config.ts
import { BullModuleOptions } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';

export const bullConfig = (config: ConfigService): BullModuleOptions => ({
  redis: {
    host: config.get('REDIS_HOST'),       // Upstash Redis URL
    port: config.get('REDIS_PORT'),       // Upstash Redis port
    password: config.get('REDIS_PASSWORD'), // Upstash Redis password
    tls: {},                              // Required for Upstash (SSL)
  },
});