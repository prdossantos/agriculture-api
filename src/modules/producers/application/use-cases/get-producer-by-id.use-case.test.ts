import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Producer } from '../../domain/entities/producer.entity';
import { ProducerService } from '../../infrastructure/services/producer.service';
import { GetProducerByIdUseCase } from './get-producer-by-id.use-case';

describe('GetProducerByIdUseCase', () => {
  let getProducerByIdUseCase: GetProducerByIdUseCase;
  let producerService: ProducerService;

  const mockProducerService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetProducerByIdUseCase,
        { provide: ProducerService, useValue: mockProducerService },
      ],
    }).compile();

    getProducerByIdUseCase = module.get<GetProducerByIdUseCase>(
      GetProducerByIdUseCase,
    );
    producerService = module.get<ProducerService>(ProducerService);
  });

  it('should be defined', () => {
    expect(getProducerByIdUseCase).toBeDefined();
  });

  it('should return a producer if found', async () => {
    const producer = new Producer();
    producer.id = 1;
    producer.name = 'Test Producer';

    mockProducerService.findOne.mockResolvedValue(producer);

    const result = await getProducerByIdUseCase.execute(1);
    expect(result).toEqual(producer);
    expect(producerService.findOne).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException if producer not found', async () => {
    mockProducerService.findOne.mockResolvedValue(null);

    await expect(getProducerByIdUseCase.execute(1)).rejects.toThrow(
      NotFoundException,
    );
    expect(producerService.findOne).toHaveBeenCalledWith(1);
  });
});
