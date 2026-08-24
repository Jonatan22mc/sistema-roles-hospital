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
import { PerfilesService } from './perfiles.service';
import { CreatePerfilDto } from './dto/create-perfil.dto';
import { UpdatePerfilDto } from './dto/update-perfil.dto';
import { QueryPerfilDto } from './dto/query-perfil.dto';

const parseUUIDPipe = new ParseUUIDPipe({
  version: '4',
  exceptionFactory: () =>
    new BadRequestException('El ID del perfil debe ser un UUID válido'),
});

@ApiTags('Perfiles')
@Controller('perfiles')
export class PerfilesController {
  constructor(private readonly perfilesService: PerfilesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear el perfil de un usuario' })
  @ApiResponse({ status: 201, description: 'Perfil creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({
    status: 404,
    description: 'El usuario especificado no existe o fue dado de baja',
  })
  @ApiResponse({
    status: 409,
    description: 'El usuario ya cuenta con un perfil registrado',
  })
  async create(@Body() createPerfilDto: CreatePerfilDto) {
    const datos = await this.perfilesService.create(createPerfilDto);
    return {
      message: 'Perfil creado exitosamente',
      datos,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los perfiles de usuario' })
  @ApiResponse({
    status: 200,
    description: 'Lista de perfiles obtenida exitosamente',
  })
  async findAll(@Query() queryPerfilDto: QueryPerfilDto) {
    const datos = await this.perfilesService.findAll(queryPerfilDto);
    return {
      message: 'Perfiles obtenidos exitosamente',
      datos,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener el detalle de un perfil por su ID' })
  @ApiParam({ name: 'id', description: 'UUID del perfil', type: 'string' })
  @ApiResponse({ status: 200, description: 'Perfil obtenido exitosamente' })
  @ApiResponse({ status: 400, description: 'ID inválido (no es UUID)' })
  @ApiResponse({
    status: 404,
    description: 'El perfil especificado no existe',
  })
  async findOne(@Param('id', parseUUIDPipe) id: string) {
    const datos = await this.perfilesService.findOne(id);
    return {
      message: 'Perfil obtenido exitosamente',
      datos,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar los datos de un perfil' })
  @ApiParam({ name: 'id', description: 'UUID del perfil', type: 'string' })
  @ApiResponse({ status: 200, description: 'Perfil actualizado exitosamente' })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos o ID inválido',
  })
  @ApiResponse({
    status: 404,
    description: 'El perfil o usuario especificado no existe',
  })
  @ApiResponse({
    status: 409,
    description: 'El usuario ya cuenta con un perfil registrado',
  })
  async update(
    @Param('id', parseUUIDPipe) id: string,
    @Body() updatePerfilDto: UpdatePerfilDto,
  ) {
    const datos = await this.perfilesService.update(id, updatePerfilDto);
    return {
      message: 'Perfil actualizado exitosamente',
      datos,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un perfil de usuario' })
  @ApiParam({ name: 'id', description: 'UUID del perfil', type: 'string' })
  @ApiResponse({ status: 200, description: 'Perfil eliminado exitosamente' })
  @ApiResponse({ status: 400, description: 'ID inválido (no es UUID)' })
  @ApiResponse({
    status: 404,
    description: 'El perfil especificado no existe',
  })
  async remove(@Param('id', parseUUIDPipe) id: string) {
    const datos = await this.perfilesService.remove(id);
    return {
      message: 'Perfil eliminado exitosamente',
      datos,
    };
  }
}
