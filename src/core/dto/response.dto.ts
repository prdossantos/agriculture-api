import { z } from 'zod';
import { extendApi } from '@anatine/zod-openapi';
import { createZodDto } from '@anatine/zod-nestjs';
import { v4 } from 'uuid';

export const BaseResponseSchema = extendApi(
    z.object({
      success: z.boolean().default(true),
      data: z.array(z.unknown()).or(z.string()),
      meta: z.object({
        requestId: z.string().uuid(),
        timestamp: z.coerce.date().optional().describe('Last update date'),
      }),
    })
  );

export const BaseErrorResponseSchema = extendApi(
    z.object({
      success: z.boolean().default(false),
      errors: z.array(z.string()),
      meta: z.object({
        requestId: z.string().uuid(),
        timestamp: z.coerce.date().optional().describe('Last update date'),
      }),
    })
  );

export class BaseResponseDto extends createZodDto(BaseResponseSchema) {};

export class ErrorResponseDto extends createZodDto(BaseErrorResponseSchema) {};

export const ErrorResponseExemple = (errors: string[]): ErrorResponseDto => ({
  success: false,
  errors,
  meta: {
    requestId: v4(),
    timestamp: new Date(),
  }
})