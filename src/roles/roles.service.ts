import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { and, eq, ilike, isNull, ne } from 'drizzle-orm';
import { DrizzleService } from '../drizzle/drizzle.service';
import { roles, Rol } from '../drizzle/schema/roles';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';
import { QueryRolDto } from './dto/query-rol.dto';

@Injectable()
export class RolesService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async create(createRolDto: CreateRolDto): Promise<Rol> {
    const nombreNormalizado = createRolDto.nombre.trim();

    const [rolExistente] = await this.drizzleService.db
      .select()
      .from(roles)
      .where(and(eq(roles.nombre, nombreNormalizado), isNull(roles.deletedAt)))
      .limit(1);

    if (rolExistente) {
      throw new ConflictException('Ya existe un rol activo con ese nombre');
    }

    const [nuevoRol] = await this.drizzleService.db
      .insert(roles)
      .values({
        nombre: nombreNormalizado,
        descripcion: createRolDto.descripcion?.trim() || null,
      })
      .returning();

    return nuevoRol;
  }

  async findAll(query?: QueryRolDto): Promise<Rol[]> {
    const condiciones = [isNull(roles.deletedAt)];

    if (query?.nombre) {
      condiciones.push(ilike(roles.nombre, `%${query.nombre.trim()}%`));
    }

    const rolesEncontrados = await this.drizzleService.db
      .select()
      .from(roles)
      .where(and(...condiciones));

    return rolesEncontrados;
  }

  async findOne(id: string): Promise<Rol> {
    const [rol] = await this.drizzleService.db
      .select()
      .from(roles)
      .where(and(eq(roles.id, id), isNull(roles.deletedAt)))
      .limit(1);

    if (!rol) {
      throw new NotFoundException('El rol especificado no existe o fue dado de baja');
    }

    return rol;
  }

  async update(id: string, updateRolDto: UpdateRolDto): Promise<Rol> {
    await this.findOne(id);

    if (updateRolDto.nombre) {
      const nombreNormalizado = updateRolDto.nombre.trim();
      const [rolConMismoNombre] = await this.drizzleService.db
        .select()
        .from(roles)
        .where(
          and(
            eq(roles.nombre, nombreNormalizado),
            ne(roles.id, id),
            isNull(roles.deletedAt),
          ),
        )
        .limit(1);

      if (rolConMismoNombre) {
        throw new ConflictException('Ya existe un rol activo con ese nombre');
      }
    }

    const [rolActualizado] = await this.drizzleService.db
      .update(roles)
      .set({
        ...(updateRolDto.nombre !== undefined && {
          nombre: updateRolDto.nombre.trim(),
        }),
        ...(updateRolDto.descripcion !== undefined && {
          descripcion: updateRolDto.descripcion?.trim() || null,
        }),
        updatedAt: new Date(),
      })
      .where(and(eq(roles.id, id), isNull(roles.deletedAt)))
      .returning();

    return rolActualizado;
  }

  async remove(id: string): Promise<Rol> {
    await this.findOne(id);

    const [rolEliminado] = await this.drizzleService.db
      .update(roles)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(eq(roles.id, id), isNull(roles.deletedAt)))
      .returning();

    return rolEliminado;
  }
}
