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
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { QueryUsuarioDto } from './dto/query-usuario.dto';

const parseUUIDPipe = new ParseUUIDPipe({
  version: '4',
  exceptionFactory: () =>
    new BadRequestException('El ID del usuario debe ser un UUID válido'),
});

@ApiTags('Usuarios')
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar un nuevo usuario en el sistema' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({
    status: 404,
    description: 'El rol especificado no existe o fue dado de baja',
  })
  @ApiResponse({
    status: 409,
    description:
      'Ya existe un usuario activo registrado con ese correo electrónico',
  })
  async create(@Body() createUsuarioDto: CreateUsuarioDto) {
    const datos = await this.usuariosService.create(createUsuarioDto);
    return {
      message: 'Usuario creado exitosamente',
      datos,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los usuarios activos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios obtenida exitosamente',
  })
  async findAll(@Query() queryUsuarioDto: QueryUsuarioDto) {
    const datos = await this.usuariosService.findAll(queryUsuarioDto);
    return {
      message: 'Usuarios obtenidos exitosamente',
      datos,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener el detalle de un usuario por su ID' })
  @ApiParam({ name: 'id', description: 'UUID del usuario', type: 'string' })
  @ApiResponse({ status: 200, description: 'Usuario obtenido exitosamente' })
  @ApiResponse({ status: 400, description: 'ID inválido (no es UUID)' })
  @ApiResponse({
    status: 404,
    description: 'El usuario especificado no existe o fue dado de baja',
  })
  async findOne(@Param('id', parseUUIDPipe) id: string) {
    const datos = await this.usuariosService.findOne(id);
    return {
      message: 'Usuario obtenido exitosamente',
      datos,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar información de un usuario' })
  @ApiParam({ name: 'id', description: 'UUID del usuario', type: 'string' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado exitosamente' })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos o ID inválido',
  })
  @ApiResponse({
    status: 404,
    description: 'El usuario o el rol especificado no existe o fue dado de baja',
  })
  @ApiResponse({
    status: 409,
    description:
      'Ya existe un usuario activo registrado con ese correo electrónico',
  })
  async update(
    @Param('id', parseUUIDPipe) id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    const datos = await this.usuariosService.update(id, updateUsuarioDto);
    return {
      message: 'Usuario actualizado exitosamente',
      datos,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar lógicamente un usuario' })
  @ApiParam({ name: 'id', description: 'UUID del usuario', type: 'string' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado exitosamente' })
  @ApiResponse({ status: 400, description: 'ID inválido (no es UUID)' })
  @ApiResponse({
    status: 404,
    description: 'El usuario especificado no existe o fue dado de baja',
  })
  @ApiResponse({
    status: 409,
    description:
      'No se puede dar de baja al usuario porque cuenta con expedientes clínicos activos registrados',
  })
  async remove(@Param('id', parseUUIDPipe) id: string) {
    const datos = await this.usuariosService.remove(id);
    return {
      message: 'Usuario eliminado exitosamente',
      datos,
    };
  }
}
