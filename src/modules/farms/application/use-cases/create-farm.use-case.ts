import { ConflictException, Injectable } from '@nestjs/common';
import { CreateFarmDto } from '../dto/create-farm.dto';
import { Farm } from '../../domain/entities/farm.entity';
import { FarmService } from '../../infrastructure/services/farm.service';

@Injectable()
export class CreateFarmUseCase {
  constructor(private readonly farmService: FarmService) {}

  async execute(producerId: number, dto: CreateFarmDto): Promise<Farm> {
    const farm = new Farm();
    farm.producerId = producerId;
    farm.name = dto.name;
    farm.city = dto.city;
    farm.state = dto.state;
    farm.totalArea = Number(dto.totalArea);
    farm.agriculturalArea = Number(dto.agriculturalArea);
    farm.vegetationArea = Number(dto.vegetationArea);

    const farmExists = await this.farmService.find({
      name: farm.name,
      producerId: farm.producerId,
    });

    if (farmExists.length) {
      throw new ConflictException({
        message: 'Farm already exists',
        extra: {
          documentId: farm.producerId,
          name: farm.name,
        },
      });
    }

    return this.farmService.save(farm);
  }
}
