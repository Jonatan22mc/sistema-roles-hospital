import { relations, sql } from 'drizzle-orm';
import { pgTable, uuid, varchar, boolean, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { roles } from './roles';
import { perfiles } from './perfiles';
import { expedientes } from './expedientes';
import { sesiones } from './sesiones';

export const usuarios = pgTable(
  'usuarios',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    email: varchar('email', { length: 255 }).notNull(),
    password: varchar('password', { length: 255 }).notNull(),
    rolId: uuid('rol_id')
      .references(() => roles.id)
      .notNull(),
    activo: boolean('activo').default(true).notNull(),
    deletedAt: timestamp('deleted_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (tabla) => [
    uniqueIndex('usuarios_email_activo_idx')
      .on(tabla.email)
      .where(sql`deleted_at IS NULL`),
  ],
);

export const usuariosRelations = relations(usuarios, ({ one, many }) => ({
  rol: one(roles, {
    fields: [usuarios.rolId],
    references: [roles.id],
  }),
  perfil: one(perfiles, {
    fields: [usuarios.id],
    references: [perfiles.usuarioId],
  }),
  expedientes: many(expedientes),
  sesiones: many(sesiones),
}));

export type Usuario = typeof usuarios.$inferSelect;
export type NuevoUsuario = typeof usuarios.$inferInsert;
