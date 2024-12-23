import { ConflictException, Injectable } from '@nestjs/common';
import { CreateProducerDto } from '../dto/create-producer.dto';
import { Producer } from '../../domain/entities/producer.entity';
import { ProducerService } from '../../infrastructure/services/producer.service';

@Injectable()
export class CreateProducerUseCase {
  constructor(private readonly producerService: ProducerService) {}

  async execute(dto: CreateProducerDto): Promise<Producer> {
    const producer = new Producer();
    producer.documentId = dto.documentId;
    producer.name = dto.name;

    const producerExists = await this.producerService.find({
      documentId: producer.documentId,
    });

    if (producerExists.length) {
      throw new ConflictException({
        message: 'Producer already exists',
        extra: {
          documentId: producer.documentId,
        },
      });
    }

    return this.producerService.save(producer);
  }
}
