import { Injectable } from '@nestjs/common';
import { Producer } from '../../domain/entities/producer.entity';
import { ProducerService } from '../../infrastructure/services/producer.service';

@Injectable()
export class ListProducerUseCase {
  constructor(private readonly producerService: ProducerService) {}

  async execute(): Promise<Producer[]> {
    return this.producerService.findAll();
  }
}
