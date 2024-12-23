import { Injectable, NotFoundException } from '@nestjs/common';
import { FarmService } from '../../infrastructure/services/farm.service';

@Injectable()
export class DeleteFarmUseCase {
  constructor(private readonly farmService: FarmService) {}

  async execute(producerId: number, id: number): Promise<void> {
    const farms = await this.farmService.find({
      id,
      producerId,
    });

    if (!farms.length) {
      throw new NotFoundException({
        message: 'Farm not found',
        extra: {
          id,
        },
      });
    }

    return this.farmService.delete(id);
  }
}
