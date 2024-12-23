import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Producer } from '../../../producers/domain/entities/producer.entity';
import { BaseEntity } from '../../../../core/entities/base.entity';

@Entity('farms')
export class Farm extends BaseEntity {
  @Column()
  producerId: number;

  @Column()
  name: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column('decimal')
  totalArea: number;

  @Column('decimal')
  agriculturalArea: number;

  @Column('decimal')
  vegetationArea: number;
}
