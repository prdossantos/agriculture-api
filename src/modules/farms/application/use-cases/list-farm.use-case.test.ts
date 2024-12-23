import { Test, TestingModule } from '@nestjs/testing';
import { ListFarmUseCase } from './list-farm.use-case';
import { FarmService } from '../../infrastructure/services/farm.service';
import { Farm } from '../../domain/entities/farm.entity';

describe('ListFarmUseCase', () => {
  let listFarmUseCase: ListFarmUseCase;
  let farmService: FarmService;

  const mockFarmService = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListFarmUseCase,
        { provide: FarmService, useValue: mockFarmService },
      ],
    }).compile();

    listFarmUseCase = module.get<ListFarmUseCase>(ListFarmUseCase);
    farmService = module.get<FarmService>(FarmService);
  });

  it('should be defined', () => {
    expect(listFarmUseCase).toBeDefined();
  });

  it('should call farmService.find with the correct producerId', async () => {
    const producerId = 1;
    const farms: Farm[] = [
      {
        id: 1,
        name: 'Farm 1',
        producerId: 1,
        city: '',
        state: '',
        totalArea: 0,
        agriculturalArea: 0,
        vegetationArea: 0,
        createdAt: undefined,
        updatedAt: undefined,
      },
    ];
    mockFarmService.find.mockResolvedValue(farms);

    const result = await listFarmUseCase.execute(producerId);

    expect(farmService.find).toHaveBeenCalledWith({ producerId });
    expect(result).toEqual(farms);
  });

  it('should return an empty array if no farms are found', async () => {
    const producerId = 2;
    mockFarmService.find.mockResolvedValue([]);

    const result = await listFarmUseCase.execute(producerId);

    expect(farmService.find).toHaveBeenCalledWith({ producerId });
    expect(result).toEqual([]);
  });
});
