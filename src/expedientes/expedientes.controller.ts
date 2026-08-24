import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ExpedientesService } from './expedientes.service';
import { CreateExpedienteDto } from './dto/create-expediente.dto';
import { UpdateExpedienteDto } from './dto/update-expediente.dto';
import { QueryExpedienteDto } from './dto/query-expediente.dto';

const parseUUIDPipe = new ParseUUIDPipe({
  version: '4',
  exceptionFactory: () =>
    new BadRequestException('El ID del expediente debe ser un UUID válido'),
});

@ApiTags('Expedientes')
@Controller('expedientes')
export class ExpedientesController {
  constructor(private readonly expedientesService: ExpedientesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar un nuevo expediente clínico' })
  @ApiResponse({
    status: 201,
    description: 'Expediente clínico registrado exitosamente',
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({
    status: 404,
    description: 'El médico tratante especificado no existe o fue dado de baja',
  })
  async create(@Body() createExpedienteDto: CreateExpedienteDto) {
    const nuevoExpediente =
      await this.expedientesService.create(createExpedienteDto);
    return {
      message: 'Expediente clínico registrado exitosamente',
      datos: nuevoExpediente,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los expedientes clínicos activos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de expedientes clínicos obtenida exitosamente',
  })
  async findAll(@Query() queryExpedienteDto: QueryExpedienteDto) {
    const listaExpedientes =
      await this.expedientesService.findAll(queryExpedienteDto);
    return {
      message: 'Expedientes clínicos obtenidos exitosamente',
      datos: listaExpedientes,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener el detalle de un expediente clínico por su ID' })
  @ApiParam({ name: 'id', description: 'UUID del expediente clínico', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Expediente clínico obtenido exitosamente',
  })
  @ApiResponse({ status: 400, description: 'ID inválido (no es UUID)' })
  @ApiResponse({
    status: 404,
    description: 'Expediente clínico no encontrado o archivado',
  })
  async findOne(@Param('id', parseUUIDPipe) id: string) {
    const expedienteEncontrado = await this.expedientesService.findOne(id);
    return {
      message: 'Expediente clínico obtenido exitosamente',
      datos: expedienteEncontrado,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar la información de un expediente clínico' })
  @ApiParam({ name: 'id', description: 'UUID del expediente clínico', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Expediente actualizado exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos o ID inválido',
  })
  @ApiResponse({
    status: 404,
    description:
      'Expediente clínico no encontrado o médico tratante no existe/inactivo',
  })
  async update(
    @Param('id', parseUUIDPipe) id: string,
    @Body() updateExpedienteDto: UpdateExpedienteDto,
  ) {
    const expedienteActualizado = await this.expedientesService.update(
      id,
      updateExpedienteDto,
    );
    return {
      message: 'Expediente actualizado exitosamente',
      datos: expedienteActualizado,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Archivar lógicamente un expediente clínico' })
  @ApiParam({ name: 'id', description: 'UUID del expediente clínico', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Expediente clínico archivado exitosamente',
  })
  @ApiResponse({ status: 400, description: 'ID inválido (no es UUID)' })
  @ApiResponse({
    status: 404,
    description: 'Expediente clínico no encontrado o archivado',
  })
  async remove(@Param('id', parseUUIDPipe) id: string) {
    await this.expedientesService.remove(id);
    return {
      message: 'Expediente clínico archivado exitosamente',
    };
  }
}
