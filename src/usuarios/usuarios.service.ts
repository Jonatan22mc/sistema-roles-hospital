import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { and, eq, ilike, isNull, ne } from 'drizzle-orm';
import { DrizzleService } from '../drizzle/drizzle.service';
import { usuarios, Usuario } from '../drizzle/schema/usuarios';
import { roles } from '../drizzle/schema/roles';
import { expedientes } from '../drizzle/schema/expedientes';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { QueryUsuarioDto } from './dto/query-usuario.dto';

export type UsuarioSinPassword = Omit<Usuario, 'password'>;

@Injectable()
export class UsuariosService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<UsuarioSinPassword> {
    const emailNormalizado = createUsuarioDto.email.trim().toLowerCase();

    const [rolExistente] = await this.drizzleService.db
      .select()
      .from(roles)
      .where(
        and(
          eq(roles.id, createUsuarioDto.rolId),
          isNull(roles.deletedAt),
        ),
      )
      .limit(1);

    if (!rolExistente) {
      throw new NotFoundException(
        'El rol especificado no existe o fue dado de baja',
      );
    }

    const [usuarioExistente] = await this.drizzleService.db
      .select()
      .from(usuarios)
      .where(
        and(
          eq(usuarios.email, emailNormalizado),
          isNull(usuarios.deletedAt),
        ),
      )
      .limit(1);

    if (usuarioExistente) {
      throw new ConflictException(
        'Ya existe un usuario activo registrado con ese correo electrónico',
      );
    }

    const saltRounds = 10;
    const passwordHasheada = await bcrypt.hash(
      createUsuarioDto.password,
      saltRounds,
    );

    const [nuevoUsuario] = await this.drizzleService.db
      .insert(usuarios)
      .values({
        email: emailNormalizado,
        password: passwordHasheada,
        rolId: createUsuarioDto.rolId,
        activo: true,
      })
      .returning({
        id: usuarios.id,
        email: usuarios.email,
        rolId: usuarios.rolId,
        activo: usuarios.activo,
        deletedAt: usuarios.deletedAt,
        createdAt: usuarios.createdAt,
        updatedAt: usuarios.updatedAt,
      });

    return nuevoUsuario;
  }

  async findAll(query?: QueryUsuarioDto): Promise<UsuarioSinPassword[]> {
    const condiciones = [isNull(usuarios.deletedAt)];

    if (query?.email) {
      condiciones.push(
        ilike(usuarios.email, `%${query.email.trim().toLowerCase()}%`),
      );
    }

    if (query?.rolId) {
      condiciones.push(eq(usuarios.rolId, query.rolId));
    }

    if (query?.activo !== undefined) {
      condiciones.push(eq(usuarios.activo, query.activo));
    }

    const listaUsuarios = await this.drizzleService.db
      .select({
        id: usuarios.id,
        email: usuarios.email,
        rolId: usuarios.rolId,
        activo: usuarios.activo,
        deletedAt: usuarios.deletedAt,
        createdAt: usuarios.createdAt,
        updatedAt: usuarios.updatedAt,
      })
      .from(usuarios)
      .where(and(...condiciones));

    return listaUsuarios;
  }

  async findOne(id: string): Promise<UsuarioSinPassword> {
    const [usuario] = await this.drizzleService.db
      .select({
        id: usuarios.id,
        email: usuarios.email,
        rolId: usuarios.rolId,
        activo: usuarios.activo,
        deletedAt: usuarios.deletedAt,
        createdAt: usuarios.createdAt,
        updatedAt: usuarios.updatedAt,
      })
      .from(usuarios)
      .where(and(eq(usuarios.id, id), isNull(usuarios.deletedAt)))
      .limit(1);

    if (!usuario) {
      throw new NotFoundException(
        'El usuario especificado no existe o fue dado de baja',
      );
    }

    return usuario;
  }

  async update(
    id: string,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<UsuarioSinPassword> {
    await this.findOne(id);

    if (updateUsuarioDto.rolId) {
      const [rolExistente] = await this.drizzleService.db
        .select()
        .from(roles)
        .where(
          and(
            eq(roles.id, updateUsuarioDto.rolId),
            isNull(roles.deletedAt),
          ),
        )
        .limit(1);

      if (!rolExistente) {
        throw new NotFoundException(
          'El rol especificado no existe o fue dado de baja',
        );
      }
    }

    if (updateUsuarioDto.email) {
      const emailNormalizado = updateUsuarioDto.email.trim().toLowerCase();
      const [usuarioConMismoEmail] = await this.drizzleService.db
        .select()
        .from(usuarios)
        .where(
          and(
            eq(usuarios.email, emailNormalizado),
            ne(usuarios.id, id),
            isNull(usuarios.deletedAt),
          ),
        )
        .limit(1);

      if (usuarioConMismoEmail) {
        throw new ConflictException(
          'Ya existe un usuario activo registrado con ese correo electrónico',
        );
      }
    }

    let passwordHasheada: string | undefined;
    if (updateUsuarioDto.password) {
      const saltRounds = 10;
      passwordHasheada = await bcrypt.hash(
        updateUsuarioDto.password,
        saltRounds,
      );
    }

    const [usuarioActualizado] = await this.drizzleService.db
      .update(usuarios)
      .set({
        ...(updateUsuarioDto.email !== undefined && {
          email: updateUsuarioDto.email.trim().toLowerCase(),
        }),
        ...(passwordHasheada !== undefined && {
          password: passwordHasheada,
        }),
        ...(updateUsuarioDto.rolId !== undefined && {
          rolId: updateUsuarioDto.rolId,
        }),
        updatedAt: new Date(),
      })
      .where(and(eq(usuarios.id, id), isNull(usuarios.deletedAt)))
      .returning({
        id: usuarios.id,
        email: usuarios.email,
        rolId: usuarios.rolId,
        activo: usuarios.activo,
        deletedAt: usuarios.deletedAt,
        createdAt: usuarios.createdAt,
        updatedAt: usuarios.updatedAt,
      });

    return usuarioActualizado;
  }

  async remove(id: string): Promise<UsuarioSinPassword> {
    await this.findOne(id);

    const [expedienteActivoAsociado] = await this.drizzleService.db
      .select()
      .from(expedientes)
      .where(and(eq(expedientes.medicoId, id), isNull(expedientes.deletedAt)))
      .limit(1);

    if (expedienteActivoAsociado) {
      throw new ConflictException(
        'No se puede dar de baja al usuario porque cuenta con expedientes clínicos activos registrados',
      );
    }

    const [usuarioEliminado] = await this.drizzleService.db
      .update(usuarios)
      .set({
        activo: false,
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(eq(usuarios.id, id), isNull(usuarios.deletedAt)))
      .returning({
        id: usuarios.id,
        email: usuarios.email,
        rolId: usuarios.rolId,
        activo: usuarios.activo,
        deletedAt: usuarios.deletedAt,
        createdAt: usuarios.createdAt,
        updatedAt: usuarios.updatedAt,
      });

    return usuarioEliminado;
  }
}
