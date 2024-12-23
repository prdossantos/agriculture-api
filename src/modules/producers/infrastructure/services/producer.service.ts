import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Producer } from '../../domain/entities/producer.entity';
import { ProducerRepository } from '../../domain/repositories/producer.repository';

@Injectable()
export class ProducerService implements ProducerRepository {
  constructor(
    @InjectRepository(Producer)
    private readonly repository: Repository<Producer>,
  ) {}

  async findOne(id: number): Promise<Producer> {
    return this.repository.findOne({ where: { id } });
  }

  async save(producer: Producer): Promise<Producer> {
    return this.repository.save(producer);
  }

  async create(data: Partial<Producer>): Promise<Producer> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async findAll(): Promise<Producer[]> {
    return this.repository.find();
  }

  async find(data: Partial<Producer>): Promise<Producer[]> {
    return this.repository.find({ where: data });
  }

  async update(id: number, producer: Partial<Producer>): Promise<Producer> {
    return this.repository.save({ id, ...producer });
  }
  async delete(id: number): Promise<void> {
    await this.repository.softDelete(id);
  }
}
