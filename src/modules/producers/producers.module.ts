import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producer } from './domain/entities/producer.entity';
import { ProducerController } from './infrastructure/controllers/producer.controller';
import { CreateProducerUseCase } from './application/use-cases/create-producer.use-case';
import { ProducerService } from './infrastructure/services/producer.service';
import { ListProducerUseCase } from './application/use-cases/list-producer.use-case';
import { UpdateProducerUseCase } from './application/use-cases/update-producer.use-case';
import { DeleteProducerUseCase } from './application/use-cases/delete-producer.use-case';
import { GetProducerByIdUseCase } from './application/use-cases/get-producer-by-id.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([Producer])],
  controllers: [ProducerController],
  providers: [
    CreateProducerUseCase,
    ListProducerUseCase,
    UpdateProducerUseCase,
    DeleteProducerUseCase,
    GetProducerByIdUseCase,
    ProducerService,
  ],
  exports: [
    CreateProducerUseCase,
    ListProducerUseCase,
    UpdateProducerUseCase,
    DeleteProducerUseCase,
    GetProducerByIdUseCase,
  ],
})
export class ProducersModule {}
