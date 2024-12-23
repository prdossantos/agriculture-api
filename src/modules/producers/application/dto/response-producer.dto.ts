import { extendApi } from '@anatine/zod-openapi';
import { createZodDto } from '@anatine/zod-nestjs';
import { ProducerSchema } from './producer.dto';
import { BaseResponseSchema } from '../../../../core/dto/response.dto';
import { z } from 'zod';

export const ResponseProducerSchema = extendApi(
  BaseResponseSchema.extend({
    data: ProducerSchema,
  }),
  {
    title: 'ResponseProducerDto',
    description: 'Return schema for a one Producer',
  },
);

export class ResponseProducerDto extends createZodDto(ResponseProducerSchema) {}

export const ResponseProducersSchema = extendApi(
  BaseResponseSchema.extend({
    data: z.array(ProducerSchema),
  }),
  {
    title: 'ResponseProducerDto',
    description: 'Return schema for Producers',
  },
);

export class ResponseProducersDto extends createZodDto(
  ResponseProducersSchema,
) {}
