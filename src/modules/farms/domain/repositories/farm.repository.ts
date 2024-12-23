import { Farm } from '../entities/farm.entity';

export interface FarmRepository {
  findAll(): Promise<Farm[]>;
  findOne(id: number): Promise<Farm>;
  save(farm: Farm): Promise<Farm>;
  update(id: number, farm: Partial<Farm>): Promise<Farm>;
  delete(id: number): Promise<void>;
}
