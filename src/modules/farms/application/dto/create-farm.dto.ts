import { extendApi } from '@anatine/zod-openapi';
import { FarmSchema } from './farm.dto';
import { createZodDto } from '@anatine/zod-nestjs';

export const CreateFarmSchema = extendApi(
  FarmSchema.omit({
    id: true,
    producerId: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
  }).refine(
    (data) => data.agriculturalArea + data.vegetationArea <= data.totalArea,
    {
      message:
        'The sum of agricultural and vegetation areas cannot exceed the total area.',
      path: ['agriculturalArea', 'vegetationArea'],
    },
  ),
  {
    title: 'CreateFarmDto',
    description: 'Schema for creating a new Farm',
  },
);

export class CreateFarmDto extends createZodDto(CreateFarmSchema) {}
