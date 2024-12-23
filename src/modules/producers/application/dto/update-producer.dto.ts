import { extendApi } from '@anatine/zod-openapi';
import { createZodDto } from '@anatine/zod-nestjs';
import { ProducerSchema } from './producer.dto';

export const UpdateProducerSchema = extendApi(
  ProducerSchema.extend({
    documentId: ProducerSchema.shape.documentId.optional(),
    name: ProducerSchema.shape.name.optional(),
  }),
  {
    title: 'UpdateProducerDto',
    description: 'Schema for updating a Producer',
  },
);

export class UpdateProducerDto extends createZodDto(UpdateProducerSchema) {}
