import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PermisosService } from './permisos.service';
import { CreatePermisoDto } from './dto/create-permiso.dto';
import { QueryPermisoDto } from './dto/query-permiso.dto';

const parseUUIDPipe = new ParseUUIDPipe({
  version: '4',
  exceptionFactory: () =>
    new BadRequestException('El ID del permiso debe ser un UUID válido'),
});

@ApiTags('Permisos')
@Controller('permisos')
export class PermisosController {
  constructor(private readonly permisosService: PermisosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo permiso en el sistema' })
  @ApiResponse({ status: 201, description: 'Permiso creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({
    status: 409,
    description: 'Ya existe un permiso con ese nombre',
  })
  async create(@Body() createPermisoDto: CreatePermisoDto) {
    const datos = await this.permisosService.create(createPermisoDto);
    return {
      message: 'Permiso creado exitosamente',
      datos,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los permisos del sistema' })
  @ApiResponse({
    status: 200,
    description: 'Lista de permisos obtenida exitosamente',
  })
  async findAll(@Query() queryPermisoDto: QueryPermisoDto) {
    const datos = await this.permisosService.findAll(queryPermisoDto);
    return {
      message: 'Permisos obtenidos exitosamente',
      datos,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener el detalle de un permiso por su ID' })
  @ApiParam({ name: 'id', description: 'UUID del permiso', type: 'string' })
  @ApiResponse({ status: 200, description: 'Permiso obtenido exitosamente' })
  @ApiResponse({ status: 400, description: 'ID inválido (no es UUID)' })
  @ApiResponse({
    status: 404,
    description: 'El permiso especificado no existe',
  })
  async findOne(@Param('id', parseUUIDPipe) id: string) {
    const datos = await this.permisosService.findOne(id);
    return {
      message: 'Permiso obtenido exitosamente',
      datos,
    };
  }
}
