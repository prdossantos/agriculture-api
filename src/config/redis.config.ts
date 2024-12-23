import { ConfigService } from '@nestjs/config';
import { CacheModuleOptions } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

export default class RedisConfig {
  static async useFactory(
    configService: ConfigService,
  ): Promise<CacheModuleOptions> {
    return {
      store: redisStore,
      host: configService.get('REDIS_HOST'),
      port: configService.get<number>('REDIS_PORT'),
      ttl: configService.get<number>('CACHE_TTL') || 300,
    };
  }
}
