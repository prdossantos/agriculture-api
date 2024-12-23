import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DeleteProducerUseCase } from './delete-producer.use-case';
import { ProducerService } from '../../infrastructure/services/producer.service';

describe('DeleteProducerUseCase', () => {
  let deleteProducerUseCase: DeleteProducerUseCase;
  let producerService: ProducerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteProducerUseCase,
        {
          provide: ProducerService,
          useValue: {
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    deleteProducerUseCase = module.get<DeleteProducerUseCase>(
      DeleteProducerUseCase,
    );
    producerService = module.get<ProducerService>(ProducerService);
  });

  it('should be defined', () => {
    expect(deleteProducerUseCase).toBeDefined();
  });

  it('should delete a producer if found', async () => {
    const producerId = 1;
    producerService.findOne = jest.fn().mockResolvedValue({ id: producerId });
    producerService.delete = jest.fn().mockResolvedValue(undefined);

    await deleteProducerUseCase.execute(producerId);

    expect(producerService.findOne).toHaveBeenCalledWith(producerId);
    expect(producerService.delete).toHaveBeenCalledWith(producerId);
  });

  it('should throw NotFoundException if producer not found', async () => {
    const producerId = 1;
    producerService.findOne = jest.fn().mockResolvedValue(null);

    await expect(deleteProducerUseCase.execute(producerId)).rejects.toThrow(
      NotFoundException,
    );
    expect(producerService.findOne).toHaveBeenCalledWith(producerId);
    expect(producerService.delete).not.toHaveBeenCalled();
  });
});
