import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Farm } from '../../domain/entities/farm.entity';
import { FarmRepository } from '../../domain/repositories/farm.repository';

@Injectable()
export class FarmService implements FarmRepository {
  constructor(
    @InjectRepository(Farm)
    private readonly repository: Repository<Farm>,
  ) {}

  async findOne(id: number): Promise<Farm> {
    return this.repository.findOne({ where: { id } });
  }

  async save(farm: Farm): Promise<Farm> {
    return this.repository.save(farm);
  }

  async create(data: Partial<Farm>): Promise<Farm> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async findAll(): Promise<Farm[]> {
    return this.repository.find();
  }

  async find(data: Partial<Farm>): Promise<Farm[]> {
    return this.repository.find({ where: data });
  }

  async update(id: number, farm: Partial<Farm>): Promise<Farm> {
    return this.repository.save({ id, ...farm });
  }
  async delete(id: number): Promise<void> {
    await this.repository.softDelete(id);
  }
}
