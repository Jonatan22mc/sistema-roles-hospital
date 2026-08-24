import { Injectable, NotFoundException } from '@nestjs/common';
import { and, eq, ilike, isNull } from 'drizzle-orm';
import { DrizzleService } from '../drizzle/drizzle.service';
import { expedientes, Expediente } from '../drizzle/schema/expedientes';
import { usuarios } from '../drizzle/schema/usuarios';
import { CreateExpedienteDto } from './dto/create-expediente.dto';
import { UpdateExpedienteDto } from './dto/update-expediente.dto';
import { QueryExpedienteDto } from './dto/query-expediente.dto';

@Injectable()
export class ExpedientesService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async create(createExpedienteDto: CreateExpedienteDto): Promise<Expediente> {
    const [medicoActivo] = await this.drizzleService.db
      .select()
      .from(usuarios)
      .where(
        and(
          eq(usuarios.id, createExpedienteDto.medicoId),
          eq(usuarios.activo, true),
          isNull(usuarios.deletedAt),
        ),
      )
      .limit(1);

    if (!medicoActivo) {
      throw new NotFoundException(
        'El médico tratante especificado no existe o fue dado de baja',
      );
    }

    const [nuevoExpediente] = await this.drizzleService.db
      .insert(expedientes)
      .values({
        pacienteNombre: createExpedienteDto.pacienteNombre.trim(),
        pacienteDocumento: createExpedienteDto.pacienteDocumento.trim(),
        medicoId: createExpedienteDto.medicoId,
        diagnostico: createExpedienteDto.diagnostico.trim(),
        tratamiento: createExpedienteDto.tratamiento.trim(),
      })
      .returning();

    return nuevoExpediente;
  }

  async findAll(query?: QueryExpedienteDto): Promise<Expediente[]> {
    const condiciones = [isNull(expedientes.deletedAt)];

    if (query?.pacienteDocumento) {
      condiciones.push(
        ilike(
          expedientes.pacienteDocumento,
          `%${query.pacienteDocumento.trim()}%`,
        ),
      );
    }

    if (query?.pacienteNombre) {
      condiciones.push(
        ilike(expedientes.pacienteNombre, `%${query.pacienteNombre.trim()}%`),
      );
    }

    if (query?.medicoId) {
      condiciones.push(eq(expedientes.medicoId, query.medicoId));
    }

    const expedientesEncontrados = await this.drizzleService.db
      .select()
      .from(expedientes)
      .where(and(...condiciones));

    return expedientesEncontrados;
  }

  async findOne(id: string): Promise<Expediente> {
    const [expedienteEncontrado] = await this.drizzleService.db
      .select()
      .from(expedientes)
      .where(and(eq(expedientes.id, id), isNull(expedientes.deletedAt)))
      .limit(1);

    if (!expedienteEncontrado) {
      throw new NotFoundException(
        'Expediente clínico no encontrado o archivado',
      );
    }

    return expedienteEncontrado;
  }

  async update(
    id: string,
    updateExpedienteDto: UpdateExpedienteDto,
  ): Promise<Expediente> {
    await this.findOne(id);

    if (updateExpedienteDto.medicoId) {
      const [medicoActivo] = await this.drizzleService.db
        .select()
        .from(usuarios)
        .where(
          and(
            eq(usuarios.id, updateExpedienteDto.medicoId),
            eq(usuarios.activo, true),
            isNull(usuarios.deletedAt),
          ),
        )
        .limit(1);

      if (!medicoActivo) {
        throw new NotFoundException(
          'El médico tratante especificado no existe o fue dado de baja',
        );
      }
    }

    const [expedienteActualizado] = await this.drizzleService.db
      .update(expedientes)
      .set({
        ...(updateExpedienteDto.pacienteNombre !== undefined && {
          pacienteNombre: updateExpedienteDto.pacienteNombre.trim(),
        }),
        ...(updateExpedienteDto.pacienteDocumento !== undefined && {
          pacienteDocumento: updateExpedienteDto.pacienteDocumento.trim(),
        }),
        ...(updateExpedienteDto.medicoId !== undefined && {
          medicoId: updateExpedienteDto.medicoId,
        }),
        ...(updateExpedienteDto.diagnostico !== undefined && {
          diagnostico: updateExpedienteDto.diagnostico.trim(),
        }),
        ...(updateExpedienteDto.tratamiento !== undefined && {
          tratamiento: updateExpedienteDto.tratamiento.trim(),
        }),
        updatedAt: new Date(),
      })
      .where(and(eq(expedientes.id, id), isNull(expedientes.deletedAt)))
      .returning();

    return expedienteActualizado;
  }

  async remove(id: string): Promise<Expediente> {
    await this.findOne(id);

    const [expedienteArchivado] = await this.drizzleService.db
      .update(expedientes)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(eq(expedientes.id, id), isNull(expedientes.deletedAt)))
      .returning();

    return expedienteArchivado;
  }
}
