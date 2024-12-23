import { Test, TestingModule } from '@nestjs/testing';
import { CreateProducerUseCase } from './create-producer.use-case';
import { ProducerService } from '../../infrastructure/services/producer.service';
import { ConflictException } from '@nestjs/common';
import { CreateProducerDto } from '../dto/create-producer.dto';
import { Producer } from '../../domain/entities/producer.entity';

describe('CreateProducerUseCase', () => {
  let useCase: CreateProducerUseCase;
  let producerService: jest.Mocked<ProducerService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateProducerUseCase,
        {
          provide: ProducerService,
          useValue: {
            find: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<CreateProducerUseCase>(CreateProducerUseCase);
    producerService = module.get<ProducerService>(
      ProducerService,
    ) as jest.Mocked<ProducerService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a producer successfully', async () => {
    const createProducerDto: CreateProducerDto = {
      documentId: '12345678909',
      name: 'Producer Name',
    };

    const savedProducer: Producer = {
      id: 1,
      documentId: createProducerDto.documentId,
      name: createProducerDto.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    producerService.find.mockResolvedValue([]);
    producerService.save.mockResolvedValue(savedProducer);

    const result = await useCase.execute(createProducerDto);

    expect(result).toEqual(savedProducer);
    expect(producerService.find).toHaveBeenCalledWith({
      documentId: createProducerDto.documentId,
    });
    expect(producerService.save).toHaveBeenCalledWith(
      expect.objectContaining({
        documentId: createProducerDto.documentId,
        name: createProducerDto.name,
      }),
    );
  });

  it('should throw a ConflictException if producer already exists', async () => {
    const createProducerDto: CreateProducerDto = {
      documentId: '12345678909',
      name: 'Producer Name',
    };

    const existingProducer: Producer = {
      id: 1,
      documentId: createProducerDto.documentId,
      name: createProducerDto.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    producerService.find.mockResolvedValue([existingProducer]);

    await expect(useCase.execute(createProducerDto)).rejects.toThrow(
      ConflictException,
    );
    expect(producerService.find).toHaveBeenCalledWith({
      documentId: createProducerDto.documentId,
    });
    expect(producerService.save).not.toHaveBeenCalled();
  });
});
