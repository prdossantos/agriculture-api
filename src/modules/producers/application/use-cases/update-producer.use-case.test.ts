import { Test, TestingModule } from '@nestjs/testing';
import { UpdateProducerUseCase } from './update-producer.use-case';
import { ProducerService } from '../../infrastructure/services/producer.service';
import { NotFoundException } from '@nestjs/common';
import { UpdateProducerDto } from '../dto/update-producer.dto';
import { Producer } from '../../domain/entities/producer.entity';

describe('UpdateProducerUseCase', () => {
  let updateProducerUseCase: UpdateProducerUseCase;
  let producerService: jest.Mocked<ProducerService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateProducerUseCase,
        {
          provide: ProducerService,
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    updateProducerUseCase = module.get<UpdateProducerUseCase>(
      UpdateProducerUseCase,
    );
    producerService = module.get<ProducerService>(
      ProducerService,
    ) as jest.Mocked<ProducerService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update a producer successfully', async () => {
    const producerId = 1;
    const updateProducerDto: Partial<UpdateProducerDto> = {
      name: 'Updated Name',
      documentId: '98765432100',
    };

    const existingProducer: Producer = {
      id: producerId,
      name: 'Old Name',
      documentId: '12345678909',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedProducer: Producer = {
      ...existingProducer,
      ...updateProducerDto,
      updatedAt: new Date(),
    };

    producerService.findOne.mockResolvedValue(existingProducer);
    producerService.save.mockResolvedValue(updatedProducer);

    const result = await updateProducerUseCase.execute(
      producerId,
      updateProducerDto,
    );

    expect(result).toEqual(updatedProducer);
    expect(producerService.findOne).toHaveBeenCalledWith(producerId);
    expect(producerService.save).toHaveBeenCalledWith(updatedProducer);
  });

  it('should throw NotFoundException if producer does not exist', async () => {
    const producerId = 1;
    const updateProducerDto: Partial<UpdateProducerDto> = {
      name: 'Updated Name',
    };

    producerService.findOne.mockResolvedValue(null);

    await expect(
      updateProducerUseCase.execute(producerId, updateProducerDto),
    ).rejects.toThrow(NotFoundException);

    expect(producerService.findOne).toHaveBeenCalledWith(producerId);
    expect(producerService.save).not.toHaveBeenCalled();
  });
});
