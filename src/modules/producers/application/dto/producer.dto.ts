import { z } from 'zod';
import { extendApi } from '@anatine/zod-openapi';
import { createZodDto } from '@anatine/zod-nestjs';
import { isValidCPFOrCNPJ } from '../../../../core/validators/cpf-cnpj';

export const ProducerSchema = extendApi(
  z.object({
    id: z.number().int().optional().describe('Producer identifier'),
    documentId: z
      .string()
      .regex(
        /^[0-9]{11}$|^[0-9]{14}$/,
        'CPF/CNPJ must be either 11 or 14 digits only',
      )
      .refine(isValidCPFOrCNPJ, {
        message: 'Invalid CPF or CNPJ',
      })
      .describe('The user CPF or CNPJ, with exactly 11 or 14 digits'),
    name: z
      .string()
      .min(1, 'Name is required')
      .describe('Producer name (cannot be empty)'),
    createdAt: z.coerce.date().optional().describe('Creation date'),
    updatedAt: z.coerce.date().optional().describe('Last update date'),
    deletedAt: z.coerce
      .date()
      .default(null)
      .optional()
      .describe('Deletion date'),
  }),
  {
    title: 'CreateProducerDto',
    description: 'Schema for a Producer',
  },
);

export class ProducerDto extends createZodDto(ProducerSchema) {}
