import { extendApi } from '@anatine/zod-openapi';
import { createZodDto } from '@anatine/zod-nestjs';
import { FarmSchema } from './farm.dto';
import { BaseResponseSchema } from '../../../../core/dto/response.dto';
import { z } from 'zod';

export const ResponseFarmSchema = extendApi(
  BaseResponseSchema.extend({
    data: FarmSchema,
  }),
  {
    title: 'ResponseFarmDto',
    description: 'Return schema for a one Farm',
  },
);

export class ResponseFarmDto extends createZodDto(ResponseFarmSchema) {}

export const ResponseFarmsSchema = extendApi(
  BaseResponseSchema.extend({
    data: z.array(FarmSchema),
  }),
  {
    title: 'ResponseFarmDto',
    description: 'Return schema for Farms',
  },
);

export class ResponseFarmsDto extends createZodDto(ResponseFarmsSchema) {}
