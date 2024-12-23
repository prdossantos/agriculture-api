import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  Patch,
  UsePipes,
} from '@nestjs/common';
import { CreateFarmDto } from '../../../../modules/farms/application/dto/create-farm.dto';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiConflictResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { ErrorResponseExemple } from '../../../../core/dto/response.dto';
import {
  ResponseFarmDto,
  ResponseFarmsDto,
} from '../../application/dto/response-farm.dto';
import { UpdateFarmDto } from '../../application/dto/update-farm.dto';
import { CreateFarmUseCase } from '../../application/use-cases/create-farm.use-case';
import { DeleteFarmUseCase } from '../../application/use-cases/delete-farm.use-case';
import { ListFarmUseCase } from '../../application/use-cases/list-farm.use-case';
import { UpdateFarmUseCase } from '../../application/use-cases/update-farm.use-case';
import { GetProducerByIdUseCase } from '../../../../modules/producers/application/use-cases/get-producer-by-id.use-case';

@ApiTags('Farms')
@UsePipes(ZodValidationPipe)
@Controller({ path: 'producers/:producerId/farms', version: '1' })
export class FarmController {
  constructor(
    private readonly createFarmUseCase: CreateFarmUseCase,
    private readonly listFarmUseCase: ListFarmUseCase,
    private readonly updateFarmUseCase: UpdateFarmUseCase,
    private readonly deleteFarmUseCase: DeleteFarmUseCase,
    private readonly getProducerByIdUseCase: GetProducerByIdUseCase,
  ) {}

  @ApiOperation({ summary: 'Create a new farm' })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: ResponseFarmDto,
  })
  @ApiConflictResponse({
    description: 'Farm already exists',
    example: ErrorResponseExemple(['Farm already exists']),
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    example: ErrorResponseExemple(['Invalid documentId']),
  })
  @Post()
  async create(
    @Param('producerId') producerId: number,
    @Body() data: CreateFarmDto,
  ) {
    await this.getProducerByIdUseCase.execute(producerId);

    return this.createFarmUseCase.execute(producerId, data);
  }

  @ApiOperation({ summary: 'List all farms' })
  @ApiOkResponse({
    description: 'List of farms',
    type: ResponseFarmsDto,
  })
  @Get()
  async findAll(@Param('producerId') producerId: number) {
    await this.getProducerByIdUseCase.execute(Number(producerId));
    return this.listFarmUseCase.execute(Number(producerId));
  }

  @ApiOperation({ summary: 'Update a farm' })
  @ApiOkResponse({
    description: 'Farm updated',
    type: ResponseFarmDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    example: ErrorResponseExemple(['Invalid documentId']),
  })
  @ApiConflictResponse({
    description: 'Farm already exists',
    example: ErrorResponseExemple(['Farm already exists']),
  })
  @ApiNotFoundResponse({
    description: 'Farm not found',
    example: ErrorResponseExemple(['Farm not found']),
  })
  @Patch(':farmId')
  async update(
    @Param('producerId') producerId: number,
    @Param('farmId') farmId: number,
    @Body() data: UpdateFarmDto,
  ) {
    await this.getProducerByIdUseCase.execute(Number(producerId));
    return this.updateFarmUseCase.execute(
      Number(producerId),
      Number(farmId),
      data,
    );
  }

  @ApiOperation({ summary: 'Delete a farm' })
  @ApiOkResponse({
    description: 'Farm deleted',
  })
  @ApiNotFoundResponse({
    description: 'Farm not found',
    example: ErrorResponseExemple(['Farm not found']),
  })
  @Delete(':farmId')
  async delete(
    @Param('producerId') producerId: number,
    @Param('farmId') farmId: number,
  ) {
    await this.getProducerByIdUseCase.execute(Number(producerId));
    return this.deleteFarmUseCase.execute(Number(producerId), Number(farmId));
  }
}
