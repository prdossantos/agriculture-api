import { Producer } from '../entities/producer.entity';

export interface ProducerRepository {
  findAll(): Promise<Producer[]>;
  findOne(id: number): Promise<Producer>;
  save(producer: Producer): Promise<Producer>;
  update(id: number, producer: Partial<Producer>): Promise<Producer>;
  delete(id: number): Promise<void>;
}
