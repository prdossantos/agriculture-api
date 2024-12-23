import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { FarmService } from '../../infrastructure/services/farm.service';
import { DeleteFarmUseCase } from './delete-farm.use-case';
import { Farm } from '../../domain/entities/farm.entity';

describe('DeleteFarmUseCase', () => {
  let deleteFarmUseCase: DeleteFarmUseCase;
  let farmService: FarmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteFarmUseCase,
        {
          provide: FarmService,
          useValue: {
            find: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    deleteFarmUseCase = module.get<DeleteFarmUseCase>(DeleteFarmUseCase);
    farmService = module.get<FarmService>(FarmService);
  });

  it('should be defined', () => {
    expect(deleteFarmUseCase).toBeDefined();
  });

  it('should delete a farm if it exists', async () => {
    const producerId = 1;
    const farmId = 1;

    const farms: Farm[] = [
      {
        id: farmId,

        producerId,

        name: 'Farm Name',

        city: 'City',

        state: 'State',

        totalArea: 100,

        agriculturalArea: 50,

        vegetationArea: 30,

        createdAt: new Date(),

        updatedAt: new Date(),
      },
    ];

    jest.spyOn(farmService, 'find').mockResolvedValue(farms);
    jest.spyOn(farmService, 'delete').mockResolvedValue(undefined);

    await deleteFarmUseCase.execute(producerId, farmId);

    expect(farmService.find).toHaveBeenCalledWith({ id: farmId, producerId });
    expect(farmService.delete).toHaveBeenCalledWith(farmId);
  });

  it('should throw NotFoundException if farm does not exist', async () => {
    const producerId = 1;
    const farmId = 1;

    jest.spyOn(farmService, 'find').mockResolvedValue([]);

    await expect(deleteFarmUseCase.execute(producerId, farmId)).rejects.toThrow(
      NotFoundException,
    );
    expect(farmService.find).toHaveBeenCalledWith({ id: farmId, producerId });
    expect(farmService.delete).not.toHaveBeenCalled();
  });
});
