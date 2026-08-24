import { Body, Controller, HttpCode, HttpStatus, Post, } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AutenticacionService } from './autenticacion.service';
import { LoginAutenticacionDto } from './dto/login-autenticacion.dto';

@ApiTags('Autenticación')
@Controller('autenticacion')
export class AutenticacionController {
  constructor(private readonly autenticacionService: AutenticacionService) { }

  @Post('iniciar-sesion')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión en el sistema hospitalario' })
  @ApiResponse({
    status: 200,
    description: 'Inicio de sesión exitoso',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciales incorrectas o usuario inactivo',
  })
  async iniciarSesion(@Body() loginAutenticacionDto: LoginAutenticacionDto) {
    const datos = await this.autenticacionService.iniciarSesion(
      loginAutenticacionDto,
    );
    return {
      message: 'Inicio de sesión exitoso',
      datos,
    };
  }
}
