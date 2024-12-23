import { Test, TestingModule } from '@nestjs/testing';
import { FarmController } from './farm.controller';
import { CreateFarmUseCase } from '../../application/use-cases/create-farm.use-case';
import { DeleteFarmUseCase } from '../../application/use-cases/delete-farm.use-case';
import { ListFarmUseCase } from '../../application/use-cases/list-farm.use-case';
import { UpdateFarmUseCase } from '../../application/use-cases/update-farm.use-case';
import { GetProducerByIdUseCase } from '../../../../modules/producers/application/use-cases/get-producer-by-id.use-case';
import { CreateFarmDto } from '../../application/dto/create-farm.dto';
import { UpdateFarmDto } from '../../application/dto/update-farm.dto';

describe('FarmController', () => {
  let controller: FarmController;
  let createFarmUseCase: jest.Mocked<CreateFarmUseCase>;
  let listFarmUseCase: jest.Mocked<ListFarmUseCase>;
  let updateFarmUseCase: jest.Mocked<UpdateFarmUseCase>;
  let deleteFarmUseCase: jest.Mocked<DeleteFarmUseCase>;
  let getProducerByIdUseCase: jest.Mocked<GetProducerByIdUseCase>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FarmController],
      providers: [
        {
          provide: CreateFarmUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: ListFarmUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: UpdateFarmUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: DeleteFarmUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: GetProducerByIdUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<FarmController>(FarmController);
    createFarmUseCase = module.get(CreateFarmUseCase);
    listFarmUseCase = module.get(ListFarmUseCase);
    updateFarmUseCase = module.get(UpdateFarmUseCase);
    deleteFarmUseCase = module.get(DeleteFarmUseCase);
    getProducerByIdUseCase = module.get(GetProducerByIdUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a farm successfully', async () => {
      const producerId = 1;
      const createFarmDto: CreateFarmDto = { name: 'Farm 1' };
      const expectedResult = {
        id: 1,
        name: 'Farm 1',
        city: 'City',
        state: 'State',
        totalArea: 100,
        agriculturalArea: 30,
        vegetationArea: 20,
        producerId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      getProducerByIdUseCase.execute.mockResolvedValue(undefined);
      createFarmUseCase.execute.mockResolvedValue(expectedResult);

      const result = await controller.create(producerId, createFarmDto);

      expect(result).toEqual(expectedResult);
      expect(getProducerByIdUseCase.execute).toHaveBeenCalledWith(producerId);
      expect(createFarmUseCase.execute).toHaveBeenCalledWith(
        producerId,
        createFarmDto,
      );
    });

    it('should throw an error if producer does not exist', async () => {
      const producerId = 1;
      const createFarmDto: CreateFarmDto = { name: 'Farm 1' };

      getProducerByIdUseCase.execute.mockRejectedValue(
        new Error('Producer not found'),
      );

      await expect(
        controller.create(producerId, createFarmDto),
      ).rejects.toThrow('Producer not found');
      expect(getProducerByIdUseCase.execute).toHaveBeenCalledWith(producerId);
      expect(createFarmUseCase.execute).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all farms for a producer', async () => {
      const producerId = 1;
      const expectedResult = [
        {
          id: 1,
          name: 'Farm 1',
          city: 'City',
          state: 'State',
          totalArea: 100,
          agriculturalArea: 30,
          vegetationArea: 20,
          producerId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      getProducerByIdUseCase.execute.mockResolvedValue(undefined);
      listFarmUseCase.execute.mockResolvedValue(expectedResult);

      const result = await controller.findAll(producerId);

      expect(result).toEqual(expectedResult);
      expect(getProducerByIdUseCase.execute).toHaveBeenCalledWith(producerId);
      expect(listFarmUseCase.execute).toHaveBeenCalledWith(producerId);
    });

    it('should throw an error if producer does not exist', async () => {
      const producerId = 1;

      getProducerByIdUseCase.execute.mockRejectedValue(
        new Error('Producer not found'),
      );

      await expect(controller.findAll(producerId)).rejects.toThrow(
        'Producer not found',
      );
      expect(getProducerByIdUseCase.execute).toHaveBeenCalledWith(producerId);
      expect(listFarmUseCase.execute).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a farm successfully', async () => {
      const producerId = 1;
      const farmId = 1;
      const updateFarmDto: UpdateFarmDto = { name: 'Updated Farm' };
      const expectedResult = {
        id: farmId,
        producerId,
        name: 'Updated Farm',
        city: 'City',
        state: 'State',
        totalArea: 100,
        agriculturalArea: 30,
        vegetationArea: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      getProducerByIdUseCase.execute.mockResolvedValue(undefined);
      updateFarmUseCase.execute.mockResolvedValue(expectedResult);

      const result = await controller.update(producerId, farmId, updateFarmDto);

      expect(result).toEqual(expectedResult);
      expect(getProducerByIdUseCase.execute).toHaveBeenCalledWith(producerId);
      expect(updateFarmUseCase.execute).toHaveBeenCalledWith(
        producerId,
        farmId,
        updateFarmDto,
      );
    });

    it('should throw an error if producer does not exist', async () => {
      const producerId = 1;
      const farmId = 1;
      const updateFarmDto: UpdateFarmDto = { name: 'Updated Farm' };

      getProducerByIdUseCase.execute.mockRejectedValue(
        new Error('Producer not found'),
      );

      await expect(
        controller.update(producerId, farmId, updateFarmDto),
      ).rejects.toThrow('Producer not found');
      expect(getProducerByIdUseCase.execute).toHaveBeenCalledWith(producerId);
      expect(updateFarmUseCase.execute).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a farm successfully', async () => {
      const producerId = 1;
      const farmId = 1;

      getProducerByIdUseCase.execute.mockResolvedValue(undefined);
      deleteFarmUseCase.execute.mockResolvedValue(undefined);

      const result = await controller.delete(producerId, farmId);

      expect(result).toBeUndefined();
      expect(getProducerByIdUseCase.execute).toHaveBeenCalledWith(producerId);
      expect(deleteFarmUseCase.execute).toHaveBeenCalledWith(
        producerId,
        farmId,
      );
    });

    it('should throw an error if producer does not exist', async () => {
      const producerId = 1;
      const farmId = 1;

      getProducerByIdUseCase.execute.mockRejectedValue(
        new Error('Producer not found'),
      );

      await expect(controller.delete(producerId, farmId)).rejects.toThrow(
        'Producer not found',
      );
      expect(getProducerByIdUseCase.execute).toHaveBeenCalledWith(producerId);
      expect(deleteFarmUseCase.execute).not.toHaveBeenCalled();
    });
  });
});
