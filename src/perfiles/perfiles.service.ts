import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { and, eq, ilike, isNull, ne } from 'drizzle-orm';
import { DrizzleService } from '../drizzle/drizzle.service';
import { perfiles, Perfil } from '../drizzle/schema/perfiles';
import { usuarios } from '../drizzle/schema/usuarios';
import { CreatePerfilDto } from './dto/create-perfil.dto';
import { UpdatePerfilDto } from './dto/update-perfil.dto';
import { QueryPerfilDto } from './dto/query-perfil.dto';

@Injectable()
export class PerfilesService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async create(createPerfilDto: CreatePerfilDto): Promise<Perfil> {
    const [usuarioExistente] = await this.drizzleService.db
      .select()
      .from(usuarios)
      .where(
        and(
          eq(usuarios.id, createPerfilDto.usuarioId),
          isNull(usuarios.deletedAt),
        ),
      )
      .limit(1);

    if (!usuarioExistente) {
      throw new NotFoundException(
        'El usuario especificado no existe o fue dado de baja',
      );
    }

    const [perfilExistente] = await this.drizzleService.db
      .select()
      .from(perfiles)
      .where(eq(perfiles.usuarioId, createPerfilDto.usuarioId))
      .limit(1);

    if (perfilExistente) {
      throw new ConflictException(
        'El usuario ya cuenta con un perfil registrado',
      );
    }

    const [nuevoPerfil] = await this.drizzleService.db
      .insert(perfiles)
      .values({
        usuarioId: createPerfilDto.usuarioId,
        nombres: createPerfilDto.nombres.trim(),
        apellidos: createPerfilDto.apellidos.trim(),
        telefono: createPerfilDto.telefono?.trim() || null,
        documento: createPerfilDto.documento.trim(),
      })
      .returning();

    return nuevoPerfil;
  }

  async findAll(query?: QueryPerfilDto): Promise<Perfil[]> {
    const condiciones = [];

    if (query?.nombres) {
      condiciones.push(ilike(perfiles.nombres, `%${query.nombres.trim()}%`));
    }

    if (query?.apellidos) {
      condiciones.push(
        ilike(perfiles.apellidos, `%${query.apellidos.trim()}%`),
      );
    }

    if (query?.documento) {
      condiciones.push(
        ilike(perfiles.documento, `%${query.documento.trim()}%`),
      );
    }

    if (condiciones.length > 0) {
      return this.drizzleService.db
        .select()
        .from(perfiles)
        .where(and(...condiciones));
    }

    return this.drizzleService.db.select().from(perfiles);
  }

  async findOne(id: string): Promise<Perfil> {
    const [perfil] = await this.drizzleService.db
      .select()
      .from(perfiles)
      .where(eq(perfiles.id, id))
      .limit(1);

    if (!perfil) {
      throw new NotFoundException('El perfil especificado no existe');
    }

    return perfil;
  }

  async findByUsuarioId(usuarioId: string): Promise<Perfil | null> {
    const [perfil] = await this.drizzleService.db
      .select()
      .from(perfiles)
      .where(eq(perfiles.usuarioId, usuarioId))
      .limit(1);

    return perfil || null;
  }

  async update(id: string, updatePerfilDto: UpdatePerfilDto): Promise<Perfil> {
    await this.findOne(id);

    if (updatePerfilDto.usuarioId) {
      const [usuarioExistente] = await this.drizzleService.db
        .select()
        .from(usuarios)
        .where(
          and(
            eq(usuarios.id, updatePerfilDto.usuarioId),
            isNull(usuarios.deletedAt),
          ),
        )
        .limit(1);

      if (!usuarioExistente) {
        throw new NotFoundException(
          'El usuario especificado no existe o fue dado de baja',
        );
      }

      const [perfilConMismoUsuario] = await this.drizzleService.db
        .select()
        .from(perfiles)
        .where(
          and(
            eq(perfiles.usuarioId, updatePerfilDto.usuarioId),
            ne(perfiles.id, id),
          ),
        )
        .limit(1);

      if (perfilConMismoUsuario) {
        throw new ConflictException(
          'El usuario ya cuenta con un perfil registrado',
        );
      }
    }

    const [perfilActualizado] = await this.drizzleService.db
      .update(perfiles)
      .set({
        ...(updatePerfilDto.usuarioId !== undefined && {
          usuarioId: updatePerfilDto.usuarioId,
        }),
        ...(updatePerfilDto.nombres !== undefined && {
          nombres: updatePerfilDto.nombres.trim(),
        }),
        ...(updatePerfilDto.apellidos !== undefined && {
          apellidos: updatePerfilDto.apellidos.trim(),
        }),
        ...(updatePerfilDto.telefono !== undefined && {
          telefono: updatePerfilDto.telefono?.trim() || null,
        }),
        ...(updatePerfilDto.documento !== undefined && {
          documento: updatePerfilDto.documento.trim(),
        }),
        updatedAt: new Date(),
      })
      .where(eq(perfiles.id, id))
      .returning();

    return perfilActualizado;
  }

  async remove(id: string): Promise<Perfil> {
    await this.findOne(id);

    const [perfilEliminado] = await this.drizzleService.db
      .delete(perfiles)
      .where(eq(perfiles.id, id))
      .returning();

    return perfilEliminado;
  }
}
