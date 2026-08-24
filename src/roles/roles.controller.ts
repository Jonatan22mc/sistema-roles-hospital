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
import { RolesService } from './roles.service';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';
import { QueryRolDto } from './dto/query-rol.dto';

const parseUUIDPipe = new ParseUUIDPipe({
  version: '4',
  exceptionFactory: () =>
    new BadRequestException('El ID del rol debe ser un UUID válido'),
});

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo rol hospitalario' })
  @ApiResponse({ status: 201, description: 'Rol creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({
    status: 409,
    description: 'Ya existe un rol activo con ese nombre',
  })
  async create(@Body() createRolDto: CreateRolDto) {
    const datos = await this.rolesService.create(createRolDto);
    return {
      message: 'Rol creado exitosamente',
      datos,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los roles activos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de roles obtenida exitosamente',
  })
  async findAll(@Query() queryRolDto: QueryRolDto) {
    const datos = await this.rolesService.findAll(queryRolDto);
    return {
      message: 'Roles obtenidos exitosamente',
      datos,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener el detalle de un rol por su ID' })
  @ApiParam({ name: 'id', description: 'UUID del rol', type: 'string' })
  @ApiResponse({ status: 200, description: 'Rol obtenido exitosamente' })
  @ApiResponse({ status: 400, description: 'ID inválido (no es UUID)' })
  @ApiResponse({
    status: 404,
    description: 'El rol especificado no existe o fue dado de baja',
  })
  async findOne(@Param('id', parseUUIDPipe) id: string) {
    const datos = await this.rolesService.findOne(id);
    return {
      message: 'Rol obtenido exitosamente',
      datos,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar la información de un rol' })
  @ApiParam({ name: 'id', description: 'UUID del rol', type: 'string' })
  @ApiResponse({ status: 200, description: 'Rol actualizado exitosamente' })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos o ID inválido',
  })
  @ApiResponse({
    status: 404,
    description: 'El rol especificado no existe o fue dado de baja',
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe un rol activo con ese nombre',
  })
  async update(
    @Param('id', parseUUIDPipe) id: string,
    @Body() updateRolDto: UpdateRolDto,
  ) {
    const datos = await this.rolesService.update(id, updateRolDto);
    return {
      message: 'Rol actualizado exitosamente',
      datos,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar lógicamente un rol' })
  @ApiParam({ name: 'id', description: 'UUID del rol', type: 'string' })
  @ApiResponse({ status: 200, description: 'Rol eliminado exitosamente' })
  @ApiResponse({ status: 400, description: 'ID inválido (no es UUID)' })
  @ApiResponse({
    status: 404,
    description: 'El rol especificado no existe o fue dado de baja',
  })
  @ApiResponse({
    status: 409,
    description:
      'No se puede dar de baja el rol porque tiene usuarios activos asignados',
  })
  async remove(@Param('id', parseUUIDPipe) id: string) {
    const datos = await this.rolesService.remove(id);
    return {
      message: 'Rol eliminado exitosamente',
      datos,
    };
  }
}
