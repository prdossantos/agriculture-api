import { Test, TestingModule } from '@nestjs/testing';
import { ListProducerUseCase } from './list-producer.use-case';
import { ProducerService } from '../../infrastructure/services/producer.service';
import { Producer } from '../../domain/entities/producer.entity';

describe('ListProducerUseCase', () => {
  let listProducerUseCase: ListProducerUseCase;
  let producerService: ProducerService;

  const mockProducers: Producer[] = [
    {
      id: 1,
      name: 'Producer 1',
      documentId: 'Farm 1',
      createdAt: undefined,
      updatedAt: undefined,
    },
    {
      id: 2,
      name: 'Producer 2',
      documentId: 'Farm 2',
      createdAt: undefined,
      updatedAt: undefined,
    },
  ];

  const mockProducerService = {
    findAll: jest.fn().mockResolvedValue(mockProducers),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListProducerUseCase,
        { provide: ProducerService, useValue: mockProducerService },
      ],
    }).compile();

    listProducerUseCase = module.get<ListProducerUseCase>(ListProducerUseCase);
    producerService = module.get<ProducerService>(ProducerService);
  });

  it('should be defined', () => {
    expect(listProducerUseCase).toBeDefined();
  });

  it('should return an array of producers', async () => {
    const result = await listProducerUseCase.execute();
    expect(result).toEqual(mockProducers);
    expect(producerService.findAll).toHaveBeenCalled();
  });
});
