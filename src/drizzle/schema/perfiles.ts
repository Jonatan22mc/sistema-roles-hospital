import { relations } from 'drizzle-orm';
import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import { usuarios } from './usuarios';

export const perfiles = pgTable('perfiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  usuarioId: uuid('usuario_id')
    .references(() => usuarios.id)
    .notNull()
    .unique(),
  nombres: varchar('nombres', { length: 100 }).notNull(),
  apellidos: varchar('apellidos', { length: 100 }).notNull(),
  telefono: varchar('telefono', { length: 20 }),
  documento: varchar('documento', { length: 20 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const perfilesRelations = relations(perfiles, ({ one }) => ({
  usuario: one(usuarios, {
    fields: [perfiles.usuarioId],
    references: [usuarios.id],
  }),
}));

export type Perfil = typeof perfiles.$inferSelect;
export type NuevoPerfil = typeof perfiles.$inferInsert;
