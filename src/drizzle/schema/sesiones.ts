import { relations } from 'drizzle-orm';
import { pgTable, uuid, text, boolean, timestamp } from 'drizzle-orm/pg-core';
import { usuarios } from './usuarios';

export const sesiones = pgTable('sesiones', {
  id: uuid('id').defaultRandom().primaryKey(),
  usuarioId: uuid('usuario_id')
    .references(() => usuarios.id)
    .notNull(),
  token: text('token').notNull(),
  expiraEn: timestamp('expira_en', { withTimezone: true }).notNull(),
  activo: boolean('activo').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const sesionesRelations = relations(sesiones, ({ one }) => ({
  usuario: one(usuarios, {
    fields: [sesiones.usuarioId],
    references: [usuarios.id],
  }),
}));

export type Sesion = typeof sesiones.$inferSelect;
export type NuevaSesion = typeof sesiones.$inferInsert;
