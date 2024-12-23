import { Injectable } from '@nestjs/common';
import { Farm } from '../../domain/entities/farm.entity';
import { FarmService } from '../../infrastructure/services/farm.service';

@Injectable()
export class ListFarmUseCase {
  constructor(private readonly farmService: FarmService) {}

  async execute(producerId: number): Promise<Farm[]> {
    return this.farmService.find({ producerId });
  }
}
