import { relations } from 'drizzle-orm';
import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { usuarios } from './usuarios';

export const expedientes = pgTable('expedientes', {
  id: uuid('id').defaultRandom().primaryKey(),
  pacienteNombre: varchar('paciente_nombre', { length: 150 }).notNull(),
  pacienteDocumento: varchar('paciente_documento', { length: 20 }).notNull(),
  medicoId: uuid('medico_id')
    .references(() => usuarios.id)
    .notNull(),
  diagnostico: text('diagnostico').notNull(),
  tratamiento: text('tratamiento').notNull(),
  deletedAt: timestamp('deleted_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const expedientesRelations = relations(expedientes, ({ one }) => ({
  medico: one(usuarios, {
    fields: [expedientes.medicoId],
    references: [usuarios.id],
  }),
}));

export type Expediente = typeof expedientes.$inferSelect;
export type NuevoExpediente = typeof expedientes.$inferInsert;
