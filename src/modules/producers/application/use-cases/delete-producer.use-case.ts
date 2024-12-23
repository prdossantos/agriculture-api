import { Injectable, NotFoundException } from '@nestjs/common';
import { Producer } from '../../domain/entities/producer.entity';
import { ProducerService } from '../../infrastructure/services/producer.service';

@Injectable()
export class DeleteProducerUseCase {
  constructor(private readonly producerService: ProducerService) {}

  async execute(id: number): Promise<void> {
    const producer = await this.producerService.findOne(id);

    if (!producer) {
      throw new NotFoundException({
        message: 'Producer not found',
        extra: {
          id,
        },
      });
    }

    return this.producerService.delete(id);
  }
}
