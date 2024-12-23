import { Injectable, NotFoundException } from '@nestjs/common';
import { Producer } from '../../domain/entities/producer.entity';
import { ProducerService } from '../../infrastructure/services/producer.service';

@Injectable()
export class GetProducerByIdUseCase {
  constructor(private readonly producerService: ProducerService) {}

  async execute(id: number): Promise<Producer> {
    const producer = await this.producerService.findOne(id);

    if (!producer) {
      throw new NotFoundException({
        message: 'Producer not found',
        extra: {
          id,
        },
      });
    }

    return producer;
  }
}
