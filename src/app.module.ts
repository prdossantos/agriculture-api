import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProducersModule } from './modules/producers/producers.module';
import { FarmsModule } from './modules/farms/farms.module';
import DatabaseConfig from './config/database.config';
import { CacheModule } from '@nestjs/cache-manager';
import RedisConfig from './config/redis.config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './core/interceptors/response.interceptor';
import { Producer } from './modules/producers/domain/entities/producer.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        DatabaseConfig.useFactory(configService),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Producer]),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        RedisConfig.useFactory(configService),
      inject: [ConfigService],
    }),
    ProducersModule,
    FarmsModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
  exports: [TypeOrmModule],
})
export class AppModule {}
