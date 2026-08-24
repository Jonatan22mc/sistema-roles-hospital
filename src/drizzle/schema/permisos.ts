import { relations } from 'drizzle-orm';
import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const permisos = pgTable('permisos', {
  id: uuid('id').defaultRandom().primaryKey(),
  nombre: varchar('nombre', { length: 100 }).notNull().unique(),
  descripcion: text('descripcion'),
  modulo: varchar('modulo', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const permisosRelations = relations(permisos, () => ({}));

export type Permiso = typeof permisos.$inferSelect;
export type NuevoPermiso = typeof permisos.$inferInsert;
