import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { and, eq, isNull } from 'drizzle-orm';
import { DrizzleService } from '../drizzle/drizzle.service';
import { usuarios } from '../drizzle/schema/usuarios';
import { perfiles } from '../drizzle/schema/perfiles';
import { LoginAutenticacionDto } from './dto/login-autenticacion.dto';

@Injectable()
export class AutenticacionService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async iniciarSesion(loginAutenticacionDto: LoginAutenticacionDto) {
    const emailNormalizado = loginAutenticacionDto.email.trim().toLowerCase();

    const [usuario] = await this.drizzleService.db
      .select()
      .from(usuarios)
      .where(
        and(
          eq(usuarios.email, emailNormalizado),
          isNull(usuarios.deletedAt),
          eq(usuarios.activo, true),
        ),
      )
      .limit(1);

    if (!usuario) {
      throw new UnauthorizedException(
        'Credenciales incorrectas o usuario inactivo',
      );
    }

    const passwordValida = await bcrypt.compare(
      loginAutenticacionDto.password,
      usuario.password,
    );

    if (!passwordValida) {
      throw new UnauthorizedException(
        'Credenciales incorrectas o usuario inactivo',
      );
    }

    const [perfil] = await this.drizzleService.db
      .select()
      .from(perfiles)
      .where(eq(perfiles.usuarioId, usuario.id))
      .limit(1);

    return {
      usuario: {
        id: usuario.id,
        email: usuario.email,
        rolId: usuario.rolId,
        activo: usuario.activo,
      },
      perfil: perfil || null,
    };
  }
}
