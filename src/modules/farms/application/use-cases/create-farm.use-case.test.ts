import { Test, TestingModule } from '@nestjs/testing';
import { CreateFarmUseCase } from './create-farm.use-case';
import { FarmService } from '../../infrastructure/services/farm.service';
import { ConflictException } from '@nestjs/common';
import { CreateFarmDto } from '../dto/create-farm.dto';
import { Farm } from '../../domain/entities/farm.entity';

describe('CreateFarmUseCase', () => {
  let useCase: CreateFarmUseCase;
  let farmService: jest.Mocked<FarmService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateFarmUseCase,
        {
          provide: FarmService,
          useValue: {
            find: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<CreateFarmUseCase>(CreateFarmUseCase);
    farmService = module.get<FarmService>(
      FarmService,
    ) as jest.Mocked<FarmService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a farm successfully', async () => {
    const producerId = 1;
    const createFarmDto: CreateFarmDto = {
      name: 'Farm 1',
      city: 'City',
      state: 'State',
      totalArea: 100,
      agriculturalArea: 30,
      vegetationArea: 20,
    };

    const savedFarm: Farm = {
      id: 1,
      name: createFarmDto.name,
      city: createFarmDto.city,
      state: createFarmDto.state,
      totalArea: createFarmDto.totalArea,
      agriculturalArea: createFarmDto.agriculturalArea,
      vegetationArea: createFarmDto.vegetationArea,
      producerId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    farmService.find.mockResolvedValue([]);
    farmService.save.mockResolvedValue(savedFarm);

    const result = await useCase.execute(producerId, createFarmDto);

    expect(result).toEqual(savedFarm);
    expect(farmService.find).toHaveBeenCalledWith({
      name: createFarmDto.name,
      producerId,
    });
    expect(farmService.save).toHaveBeenCalledWith(
      expect.objectContaining({
        name: createFarmDto.name,
        city: createFarmDto.city,
        state: createFarmDto.state,
      }),
    );
  });

  it('should throw a ConflictException if the farm already exists', async () => {
    const producerId = 1;
    const createFarmDto: CreateFarmDto = {
      name: 'Farm 1',
      city: 'City',
      state: 'State',
      totalArea: 100,
      agriculturalArea: 30,
      vegetationArea: 20,
    };

    const existingFarm: Farm = {
      id: 1,
      name: createFarmDto.name,
      city: createFarmDto.city,
      state: createFarmDto.state,
      totalArea: createFarmDto.totalArea,
      agriculturalArea: createFarmDto.agriculturalArea,
      vegetationArea: createFarmDto.vegetationArea,
      producerId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    farmService.find.mockResolvedValue([existingFarm]);

    await expect(useCase.execute(producerId, createFarmDto)).rejects.toThrow(
      ConflictException,
    );
    expect(farmService.find).toHaveBeenCalledWith({
      name: createFarmDto.name,
      producerId,
    });
    expect(farmService.save).not.toHaveBeenCalled();
  });
});
