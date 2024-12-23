import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Farm } from './domain/entities/farm.entity';
import { FarmController } from './infrastructure/controllers/farm.controller';
import { CreateFarmUseCase } from './application/use-cases/create-farm.use-case';
import { ListFarmUseCase } from './application/use-cases/list-farm.use-case';
import { DeleteFarmUseCase } from './application/use-cases/delete-farm.use-case';
import { UpdateFarmUseCase } from './application/use-cases/update-farm.use-case';
import { FarmService } from './infrastructure/services/farm.service';
import { ProducersModule } from '../producers/producers.module';

@Module({
  imports: [TypeOrmModule.forFeature([Farm]), ProducersModule],
  controllers: [FarmController],
  providers: [
    CreateFarmUseCase,
    ListFarmUseCase,
    DeleteFarmUseCase,
    UpdateFarmUseCase,
    FarmService,
  ],
  exports: [
    CreateFarmUseCase,
    ListFarmUseCase,
    DeleteFarmUseCase,
    UpdateFarmUseCase,
  ],
})
export class FarmsModule {}
