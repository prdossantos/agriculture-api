import { Test, TestingModule } from '@nestjs/testing';
import { FarmService } from './farm.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Farm } from '../../domain/entities/farm.entity';

describe('FarmService', () => {
  let service: FarmService;
  let repository: jest.Mocked<Repository<Farm>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FarmService,
        {
          provide: getRepositoryToken(Farm),
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

    service = module.get<FarmService>(FarmService);
    repository = module.get<jest.Mocked<Repository<Farm>>>(
      getRepositoryToken(Farm),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a farm by id', async () => {
      const farm = { id: 1, name: 'Farm 1' } as Farm;
      repository.findOne.mockResolvedValue(farm);

      const result = await service.findOne(1);

      expect(result).toEqual(farm);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should return null if farm is not found', async () => {
      repository.findOne.mockResolvedValue(null);

      const result = await service.findOne(1);

      expect(result).toBeNull();
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('save', () => {
    it('should save a farm', async () => {
      const farm = { id: 1, name: 'Farm 1' } as Farm;
      repository.save.mockResolvedValue(farm);

      const result = await service.save(farm);

      expect(result).toEqual(farm);
      expect(repository.save).toHaveBeenCalledWith(farm);
    });
  });

  describe('create', () => {
    it('should create and save a farm', async () => {
      const data = { name: 'Farm 1' };
      const farm = { id: 1, ...data } as Farm;

      repository.create.mockReturnValue(farm);
      repository.save.mockResolvedValue(farm);

      const result = await service.create(data);

      expect(result).toEqual(farm);
      expect(repository.create).toHaveBeenCalledWith(data);
      expect(repository.save).toHaveBeenCalledWith(farm);
    });
  });

  describe('findAll', () => {
    it('should return all farms', async () => {
      const farms = [{ id: 1, name: 'Farm 1' }] as Farm[];
      repository.find.mockResolvedValue(farms);

      const result = await service.findAll();

      expect(result).toEqual(farms);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('find', () => {
    it('should find farms by criteria', async () => {
      const criteria = { name: 'Farm 1' };
      const farms = [{ id: 1, name: 'Farm 1' }] as Farm[];

      repository.find.mockResolvedValue(farms);

      const result = await service.find(criteria);

      expect(result).toEqual(farms);
      expect(repository.find).toHaveBeenCalledWith({ where: criteria });
    });
  });

  describe('update', () => {
    it('should update a farm', async () => {
      const id = 1;
      const updateData = { name: 'Updated Farm' };
      const updatedFarm = { id, ...updateData } as Farm;

      repository.save.mockResolvedValue(updatedFarm);

      const result = await service.update(id, updateData);

      expect(result).toEqual(updatedFarm);
      expect(repository.save).toHaveBeenCalledWith({ id, ...updateData });
    });
  });

  describe('delete', () => {
    it('should soft delete a farm', async () => {
      const id = 1;

      repository.softDelete.mockResolvedValue(undefined);

      await service.delete(id);

      expect(repository.softDelete).toHaveBeenCalledWith(id);
    });
  });
});
