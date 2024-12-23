import { Test, TestingModule } from '@nestjs/testing';
import { UpdateFarmUseCase } from './update-farm.use-case';
import { FarmService } from '../../infrastructure/services/farm.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateFarmDto } from '../dto/update-farm.dto';
import { Farm } from '../../domain/entities/farm.entity';

describe('UpdateFarmUseCase', () => {
  let updateFarmUseCase: UpdateFarmUseCase;
  let farmService: jest.Mocked<FarmService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateFarmUseCase,
        {
          provide: FarmService,
          useValue: {
            find: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    updateFarmUseCase = module.get<UpdateFarmUseCase>(UpdateFarmUseCase);
    farmService = module.get<FarmService>(
      FarmService,
    ) as jest.Mocked<FarmService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update a farm successfully', async () => {
    const producerId = 1;
    const farmId = 1;
    const updateFarmDto: Partial<UpdateFarmDto> = {
      name: 'Updated Farm',
      totalArea: 100,
      agriculturalArea: 50,
      vegetationArea: 40,
    };

    const existingFarm: Farm = {
      id: farmId,
      producerId,
      name: 'Old Farm',
      city: 'City',
      state: 'State',
      totalArea: 90,
      agriculturalArea: 40,
      vegetationArea: 30,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    farmService.find.mockResolvedValue([existingFarm]);
    farmService.save.mockResolvedValue({ ...existingFarm, ...updateFarmDto });

    const result = await updateFarmUseCase.execute(
      producerId,
      farmId,
      updateFarmDto,
    );

    expect(result).toEqual({ ...existingFarm, ...updateFarmDto });
    expect(farmService.find).toHaveBeenCalledWith({ id: farmId, producerId });
    expect(farmService.save).toHaveBeenCalledWith({
      ...existingFarm,
      ...updateFarmDto,
    });
  });

  it('should throw NotFoundException if farm does not exist', async () => {
    const producerId = 1;
    const farmId = 1;
    const updateFarmDto: Partial<UpdateFarmDto> = { name: 'Updated Farm' };

    farmService.find.mockResolvedValue([]);

    await expect(
      updateFarmUseCase.execute(producerId, farmId, updateFarmDto),
    ).rejects.toThrow(NotFoundException);
    expect(farmService.find).toHaveBeenCalledWith({ id: farmId, producerId });
    expect(farmService.save).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException if the sum of agricultural and vegetation areas exceeds total area', async () => {
    const producerId = 1;
    const farmId = 1;
    const updateFarmDto: Partial<UpdateFarmDto> = {
      agriculturalArea: 60,
      vegetationArea: 50,
    };

    const existingFarm: Farm = {
      id: farmId,
      producerId,
      name: 'Old Farm',
      city: 'City',
      state: 'State',
      totalArea: 100,
      agriculturalArea: 40,
      vegetationArea: 30,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    farmService.find.mockResolvedValue([existingFarm]);

    await expect(
      updateFarmUseCase.execute(producerId, farmId, updateFarmDto),
    ).rejects.toThrow(BadRequestException);
    expect(farmService.find).toHaveBeenCalledWith({ id: farmId, producerId });
    expect(farmService.save).not.toHaveBeenCalled();
  });
});
