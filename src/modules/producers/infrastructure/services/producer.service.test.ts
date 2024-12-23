import { Test, TestingModule } from '@nestjs/testing';
import { ProducerService } from './producer.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Producer } from '../../domain/entities/producer.entity';

describe('ProducerService', () => {
  let service: ProducerService;
  let repository: jest.Mocked<Repository<Producer>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProducerService,
        {
          provide: getRepositoryToken(Producer),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            find: jest.fn(),
            softDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProducerService>(ProducerService);
    repository = module.get<jest.Mocked<Repository<Producer>>>(
      getRepositoryToken(Producer),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a producer by id', async () => {
      const producer = { id: 1, name: 'Producer 1' } as Producer;
      repository.findOne.mockResolvedValue(producer);

      const result = await service.findOne(1);

      expect(result).toEqual(producer);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should return null if producer is not found', async () => {
      repository.findOne.mockResolvedValue(null);

      const result = await service.findOne(1);

      expect(result).toBeNull();
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('save', () => {
    it('should save a producer', async () => {
      const producer = { id: 1, name: 'Producer 1' } as Producer;
      repository.save.mockResolvedValue(producer);

      const result = await service.save(producer);

      expect(result).toEqual(producer);
      expect(repository.save).toHaveBeenCalledWith(producer);
    });
  });

  describe('create', () => {
    it('should create and save a producer', async () => {
      const data = { name: 'Producer 1' };
      const producer = { id: 1, ...data } as Producer;

      repository.create.mockReturnValue(producer);
      repository.save.mockResolvedValue(producer);

      const result = await service.create(data);

      expect(result).toEqual(producer);
      expect(repository.create).toHaveBeenCalledWith(data);
      expect(repository.save).toHaveBeenCalledWith(producer);
    });
  });

  describe('findAll', () => {
    it('should return all producers', async () => {
      const producers = [{ id: 1, name: 'Producer 1' }] as Producer[];
      repository.find.mockResolvedValue(producers);

      const result = await service.findAll();

      expect(result).toEqual(producers);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('find', () => {
    it('should find producers by criteria', async () => {
      const criteria = { name: 'Producer 1' };
      const producers = [{ id: 1, name: 'Producer 1' }] as Producer[];

      repository.find.mockResolvedValue(producers);

      const result = await service.find(criteria);

      expect(result).toEqual(producers);
      expect(repository.find).toHaveBeenCalledWith({ where: criteria });
    });
  });

  describe('update', () => {
    it('should update a producer', async () => {
      const id = 1;
      const updateData = { name: 'Updated Producer' };
      const updatedProducer = { id, ...updateData } as Producer;

      repository.save.mockResolvedValue(updatedProducer);

      const result = await service.update(id, updateData);

      expect(result).toEqual(updatedProducer);
      expect(repository.save).toHaveBeenCalledWith({ id, ...updateData });
    });
  });

  describe('delete', () => {
    it('should soft delete a producer', async () => {
      const id = 1;

      repository.softDelete.mockResolvedValue(undefined);

      await service.delete(id);

      expect(repository.softDelete).toHaveBeenCalledWith(id);
    });
  });
});
