import { NotFoundException } from '@nestjs/common';
import { FarmController } from './farm.controller';

describe('FarmController', () => {
  it('should create a new farm when valid producer ID and farm data are provided', async () => {
    const producerId = 1;
    const farmData = {
      name: 'Test Farm',
      city: 'Test City',
      state: 'TS',
      totalArea: 1000,
      agriculturalArea: 800,
      vegetationArea: 200,
    };

    const mockGetProducerByIdUseCase = {
      execute: jest.fn().mockResolvedValue({ id: producerId }),
    };

    const mockCreateFarmUseCase = {
      execute: jest.fn().mockResolvedValue({ ...farmData, id: 1, producerId }),
    };

    const controller = new FarmController(
      mockCreateFarmUseCase as any,
      {} as any,
      {} as any,
      {} as any,
      mockGetProducerByIdUseCase as any,
    );

    const result = await controller.create(producerId, farmData);

    expect(mockGetProducerByIdUseCase.execute).toHaveBeenCalledWith(producerId);
    expect(mockCreateFarmUseCase.execute).toHaveBeenCalledWith(
      producerId,
      farmData,
    );
    expect(result).toEqual(expect.objectContaining(farmData));
  });

  it('should throw NotFoundException when producer ID does not exist', async () => {
    const producerId = 999;
    const farmData = {
      name: 'Test Farm',
      city: 'Test City',
      state: 'TS',
      totalArea: 1000,
      agriculturalArea: 800,
      vegetationArea: 200,
    };

    const mockGetProducerByIdUseCase = {
      execute: jest.fn().mockRejectedValue(
        new NotFoundException({
          message: 'Producer not found',
          extra: { id: producerId },
        }),
      ),
    };

    const controller = new FarmController(
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      mockGetProducerByIdUseCase as any,
    );

    await expect(controller.create(producerId, farmData)).rejects.toThrow(
      NotFoundException,
    );

    expect(mockGetProducerByIdUseCase.execute).toHaveBeenCalledWith(producerId);
  });
});
