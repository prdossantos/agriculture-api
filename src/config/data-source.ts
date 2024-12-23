import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import DatabaseConfig from './database.config';

dotenvConfig();

const configService = new ConfigService(process.env);

async function createDataSource() {
  const typeOrmOptions = await DatabaseConfig.useFactory(configService);

  return new DataSource({
    type: 'postgres',
    ...typeOrmOptions,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  } as DataSourceOptions);
}

export const AppDataSource = createDataSource();
