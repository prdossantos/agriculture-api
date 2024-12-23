import { extendApi } from '@anatine/zod-openapi';
import { createZodDto } from '@anatine/zod-nestjs';
import { FarmSchema } from './farm.dto';

export const UpdateFarmSchema = extendApi(
  FarmSchema.extend({
    name: FarmSchema.shape.name.optional(),
    city: FarmSchema.shape.city.optional(),
    state: FarmSchema.shape.state.optional(),
    totalArea: FarmSchema.shape.totalArea.optional(),
    agriculturalArea: FarmSchema.shape.agriculturalArea.optional(),
    vegetationArea: FarmSchema.shape.vegetationArea.optional(),
  }).refine(
    (data) => {
      if (data.agriculturalArea && data.vegetationArea && data.totalArea) {
        return data.agriculturalArea + data.vegetationArea <= data.totalArea;
      }
      return true;
    },
    {
      message:
        'The sum of agricultural and vegetation areas cannot exceed the total area.',
      path: ['agriculturalArea', 'vegetationArea'],
    },
  ),
  {
    title: 'UpdateFarmDto',
    description: 'Schema for updating a Farm',
  },
);

export class UpdateFarmDto extends createZodDto(UpdateFarmSchema) {}
