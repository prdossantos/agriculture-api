import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Farm } from '../../../farms/domain/entities/farm.entity';
import { BaseEntity } from '../../../../core/entities/base.entity';

@Entity('producers')
export class Producer extends BaseEntity {
  @Column({ unique: true })
  documentId: string;

  @Column()
  name: string;
}
