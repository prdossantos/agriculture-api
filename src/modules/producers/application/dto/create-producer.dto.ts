import { extendApi } from '@anatine/zod-openapi';
import { createZodDto } from '@anatine/zod-nestjs';
import { ProducerSchema } from './producer.dto';

export const CreateProducerSchema = extendApi(ProducerSchema, {
  title: 'CreateProducerDto',
  description: 'Schema for creating a new Producer',
});

export class CreateProducerDto extends createZodDto(CreateProducerSchema.omit({ id: true, createdAt: true, updatedAt: true, deletedAt: true })) {}
