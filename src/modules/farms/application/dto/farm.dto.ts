import { z } from 'zod';
import { extendApi } from '@anatine/zod-openapi';
import { createZodDto } from '@anatine/zod-nestjs';

export const FarmSchema = extendApi(
  z.object({
    id: z.number().int().optional().describe('Farm identifier'),
    producerId: z.number().int().optional().describe('Producer identifier'),
    name: z
      .string()
      .min(1, 'Name is required')
      .describe('Farm name (cannot be empty)'),
    city: z.string().optional().describe('City where the farm is located'),
    state: z.string().optional().describe('State where the farm is located'),
    totalArea: z
      .number()
      .min(0, 'Total area must be positive')
      .describe('Total area of the farm in hectares'),
    agriculturalArea: z
      .number()
      .min(0, 'Agricultural area must be positive')
      .describe('Agricultural area in hectares'),
    vegetationArea: z
      .number()
      .min(0, 'Vegetation area must be positive')
      .describe('Vegetation area in hectares'),
    createdAt: z.coerce.date().optional().describe('Creation date'),
    updatedAt: z.coerce.date().optional().describe('Last update date'),
    deletedAt: z.coerce
      .date()
      .default(null)
      .optional()
      .describe('Deletion date'),
  }),
  {
    title: 'CreateFarmDto',
    description: 'Schema for a Farm',
  },
);

export class FarmDto extends createZodDto(FarmSchema) {}
