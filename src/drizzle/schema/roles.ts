import { relations } from 'drizzle-orm';
import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { usuarios } from './usuarios';

export const roles = pgTable('roles', {
  id: uuid('id').defaultRandom().primaryKey(),
  nombre: varchar('nombre', { length: 50 }).notNull().unique(),
  descripcion: text('descripcion'),
  deletedAt: timestamp('deleted_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const rolesRelations = relations(roles, ({ many }) => ({
  usuarios: many(usuarios),
}));

export type Rol = typeof roles.$inferSelect;
export type NuevoRol = typeof roles.$inferInsert;
