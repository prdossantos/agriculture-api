import { Test, TestingModule } from '@nestjs/testing';
import { ProducerController } from './producer.controller';
import { CreateProducerUseCase } from '../../application/use-cases/create-producer.use-case';
import { ListProducerUseCase } from '../../application/use-cases/list-producer.use-case';
import { UpdateProducerUseCase } from '../../application/use-cases/update-producer.use-case';
import { DeleteProducerUseCase } from '../../application/use-cases/delete-producer.use-case';
import { CreateProducerDto } from '../../application/dto/create-producer.dto';
import { UpdateProducerDto } from '../../application/dto/update-producer.dto';
import { Producer } from '../../domain/entities/producer.entity';
import { GetProducerByIdUseCase } from '../../application/use-cases/get-producer-by-id.use-case';

describe('ProducerController', () => {
  let controller: ProducerController;
  let createProducerUseCase: jest.Mocked<CreateProducerUseCase>;
  let listProducerUseCase: jest.Mocked<ListProducerUseCase>;
  let updateProducerUseCase: jest.Mocked<UpdateProducerUseCase>;
  let deleteProducerUseCase: jest.Mocked<DeleteProducerUseCase>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProducerController],
      providers: [
        {
          provide: CreateProducerUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: ListProducerUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: UpdateProducerUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: DeleteProducerUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: GetProducerByIdUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<ProducerController>(ProducerController);
    createProducerUseCase = module.get(CreateProducerUseCase);
    listProducerUseCase = module.get(ListProducerUseCase);
    updateProducerUseCase = module.get(UpdateProducerUseCase);
    deleteProducerUseCase = module.get(DeleteProducerUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a producer successfully', async () => {
      const createProducerDto: CreateProducerDto = {
        documentId: '12345678901',
        name: 'Producer 1',
      };
      const expectedResult = {
        id: 1,
        ...createProducerDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      createProducerUseCase.execute.mockResolvedValue(
        expectedResult as Producer,
      );

      const result = await controller.create(createProducerDto);

      expect(result).toEqual(expectedResult);
      expect(createProducerUseCase.execute).toHaveBeenCalledWith(
        createProducerDto,
      );
    });

    it('should throw an error if producer already exists', async () => {
      const createProducerDto: CreateProducerDto = {
        documentId: '12345678901',
        name: 'Producer 1',
      };

      createProducerUseCase.execute.mockRejectedValue(
        new Error('Producer already exists'),
      );

      await expect(controller.create(createProducerDto)).rejects.toThrow(
        'Producer already exists',
      );
      expect(createProducerUseCase.execute).toHaveBeenCalledWith(
        createProducerDto,
      );
    });
  });

  describe('findAll', () => {
    it('should return a list of producers', async () => {
      const expectedResult = [
        {
          id: 1,
          documentId: '12345678901',
          name: 'Producer 1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      listProducerUseCase.execute.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(result).toEqual(expectedResult);
      expect(listProducerUseCase.execute).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a producer successfully', async () => {
      const producerId = 1;
      const updateProducerDto: UpdateProducerDto = { name: 'Updated Producer' };
      const expectedResult = {
        id: producerId,
        documentId: '12345678901',
        name: updateProducerDto.name,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      updateProducerUseCase.execute.mockResolvedValue(expectedResult);

      const result = await controller.update(producerId, updateProducerDto);

      expect(result).toEqual(expectedResult);
      expect(updateProducerUseCase.execute).toHaveBeenCalledWith(
        producerId,
        updateProducerDto,
      );
    });

    it('should throw an error if producer does not exist', async () => {
      const producerId = 1;
      const updateProducerDto: UpdateProducerDto = { name: 'Updated Producer' };

      updateProducerUseCase.execute.mockRejectedValue(
        new Error('Producer not found'),
      );

      await expect(
        controller.update(producerId, updateProducerDto),
      ).rejects.toThrow('Producer not found');
      expect(updateProducerUseCase.execute).toHaveBeenCalledWith(
        producerId,
        updateProducerDto,
      );
    });
  });

  describe('delete', () => {
    it('should delete a producer successfully', async () => {
      const producerId = 1;

      deleteProducerUseCase.execute.mockResolvedValue(undefined);

      const result = await controller.delete(producerId);

      expect(result).toBeUndefined();
      expect(deleteProducerUseCase.execute).toHaveBeenCalledWith(producerId);
    });

    it('should throw an error if producer does not exist', async () => {
      const producerId = 1;

      deleteProducerUseCase.execute.mockRejectedValue(
        new Error('Producer not found'),
      );

      await expect(controller.delete(producerId)).rejects.toThrow(
        'Producer not found',
      );
      expect(deleteProducerUseCase.execute).toHaveBeenCalledWith(producerId);
    });
  });
});
