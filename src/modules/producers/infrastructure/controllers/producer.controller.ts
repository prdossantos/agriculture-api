import {
  Controller,
  Post,
  Body,
  Get,
  UsePipes,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateProducerDto } from '../../application/dto/create-producer.dto';
import { CreateProducerUseCase } from '../../application/use-cases/create-producer.use-case';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { ListProducerUseCase } from '../../application/use-cases/list-producer.use-case';
import {
  ResponseProducerDto,
  ResponseProducersDto,
} from '../../application/dto/response-producer.dto';
import { ErrorResponseExemple } from '../../../../core/dto/response.dto';
import { UpdateProducerDto } from '../../application/dto/update-producer.dto';
import { UpdateProducerUseCase } from '../../application/use-cases/update-producer.use-case';
import { DeleteProducerUseCase } from '../../application/use-cases/delete-producer.use-case';

@ApiTags('Producers')
@UsePipes(ZodValidationPipe)
@Controller({ path: 'producers', version: '1' })
export class ProducerController {
  constructor(
    private readonly createProducerUseCase: CreateProducerUseCase,
    private readonly listProducerUseCase: ListProducerUseCase,
    private readonly updateProducerUseCase: UpdateProducerUseCase,
    private readonly deleteProducerUseCase: DeleteProducerUseCase,
  ) {}

  @ApiOperation({ summary: 'Create a new producer' })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: ResponseProducerDto,
  })
  @ApiConflictResponse({
    description: 'Producer already exists',
    example: ErrorResponseExemple(['Producer already exists']),
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    example: ErrorResponseExemple(['Invalid documentId']),
  })
  @Post()
  async create(@Body() data: CreateProducerDto) {
    return this.createProducerUseCase.execute(data);
  }

  @ApiOperation({ summary: 'List all producers' })
  @ApiOkResponse({
    description: 'List of producers',
    type: ResponseProducersDto,
  })
  @Get()
  async findAll() {
    return this.listProducerUseCase.execute();
  }

  @ApiOperation({ summary: 'Update a producer' })
  @ApiOkResponse({
    description: 'Producer updated',
    type: ResponseProducerDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    example: ErrorResponseExemple(['Invalid documentId']),
  })
  @ApiConflictResponse({
    description: 'Producer already exists',
    example: ErrorResponseExemple(['Producer already exists']),
  })
  @ApiNotFoundResponse({
    description: 'Producer not found',
    example: ErrorResponseExemple(['Producer not found']),
  })
  @Patch(':producerId')
  async update(
    @Param('producerId') producerId: number,
    @Body() data: UpdateProducerDto,
  ) {
    return this.updateProducerUseCase.execute(Number(producerId), data);
  }

  @ApiOperation({ summary: 'Delete a producer' })
  @ApiOkResponse({
    description: 'Producer deleted',
  })
  @ApiNotFoundResponse({
    description: 'Producer not found',
    example: ErrorResponseExemple(['Producer not found']),
  })
  @Delete(':producerId')
  async delete(@Param('producerId') producerId: number) {
    return this.deleteProducerUseCase.execute(Number(producerId));
  }
}
