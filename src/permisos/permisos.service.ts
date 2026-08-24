import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { and, eq, ilike } from 'drizzle-orm';
import { DrizzleService } from '../drizzle/drizzle.service';
import { permisos, Permiso } from '../drizzle/schema/permisos';
import { CreatePermisoDto } from './dto/create-permiso.dto';
import { QueryPermisoDto } from './dto/query-permiso.dto';

@Injectable()
export class PermisosService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async create(createPermisoDto: CreatePermisoDto): Promise<Permiso> {
    const nombreNormalizado = createPermisoDto.nombre.trim();
    const moduloNormalizado = createPermisoDto.modulo.trim();

    const [permisoExistente] = await this.drizzleService.db
      .select()
      .from(permisos)
      .where(eq(permisos.nombre, nombreNormalizado))
      .limit(1);

    if (permisoExistente) {
      throw new ConflictException('Ya existe un permiso con ese nombre');
    }

    const [nuevoPermiso] = await this.drizzleService.db
      .insert(permisos)
      .values({
        nombre: nombreNormalizado,
        descripcion: createPermisoDto.descripcion?.trim() || null,
        modulo: moduloNormalizado,
      })
      .returning();

    return nuevoPermiso;
  }

  async findAll(query?: QueryPermisoDto): Promise<Permiso[]> {
    const condiciones = [];

    if (query?.nombre) {
      condiciones.push(ilike(permisos.nombre, `%${query.nombre.trim()}%`));
    }

    if (query?.modulo) {
      condiciones.push(ilike(permisos.modulo, `%${query.modulo.trim()}%`));
    }

    if (condiciones.length > 0) {
      return this.drizzleService.db
        .select()
        .from(permisos)
        .where(and(...condiciones));
    }

    return this.drizzleService.db.select().from(permisos);
  }

  async findOne(id: string): Promise<Permiso> {
    const [permiso] = await this.drizzleService.db
      .select()
      .from(permisos)
      .where(eq(permisos.id, id))
      .limit(1);

    if (!permiso) {
      throw new NotFoundException('El permiso especificado no existe');
    }

    return permiso;
  }
}
