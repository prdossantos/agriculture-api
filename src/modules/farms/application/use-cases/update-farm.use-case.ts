import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateFarmDto } from '../dto/update-farm.dto';
import { Farm } from '../../domain/entities/farm.entity';
import { FarmService } from '../../infrastructure/services/farm.service';

@Injectable()
export class UpdateFarmUseCase {
  constructor(private readonly farmService: FarmService) {}

  async execute(
    producerId: number,
    id: number,
    dto: Partial<UpdateFarmDto>,
  ): Promise<Farm> {
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

    const farm = farms[0];

    farm.name = dto.name || farm.name;
    farm.city = dto.city || farm.city;
    farm.state = dto.state || farm.state;
    farm.totalArea = Number(dto.totalArea || farm.totalArea);
    farm.agriculturalArea = Number(
      dto.agriculturalArea || farm.agriculturalArea,
    );
    farm.vegetationArea = Number(dto.vegetationArea || farm.vegetationArea);

    if (farm.agriculturalArea + farm.vegetationArea > farm.totalArea) {
      throw new BadRequestException({
        message:
          'The sum of agricultural and vegetation areas cannot exceed the total area.',
        extra: {
          totalArea: farm.totalArea,
          agriculturalArea: farm.agriculturalArea,
          vegetationArea: farm.vegetationArea,
        },
      });
    }

    return this.farmService.save(farm);
  }
}
