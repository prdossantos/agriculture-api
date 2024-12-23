import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateProducerDto } from '../dto/update-producer.dto';
import { Producer } from '../../domain/entities/producer.entity';
import { ProducerService } from '../../infrastructure/services/producer.service';

@Injectable()
export class UpdateProducerUseCase {
  constructor(private readonly producerService: ProducerService) {}

  async execute(
    id: number,
    dto: Partial<UpdateProducerDto>,
  ): Promise<Producer> {
    const producer = await this.producerService.findOne(id);

    if (!producer) {
      throw new NotFoundException({
        message: 'Producer not found',
        extra: {
          id,
        },
      });
    }

    producer.name = dto.name || producer.name;
    producer.documentId = dto.documentId || producer.documentId;

    return this.producerService.save(producer);
  }
}
