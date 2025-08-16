import { serial, text, pgTable, timestamp, integer, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const clientStatusEnum = pgEnum('client_status', ['active', 'inactive', 'prospective']);
export const caseStatusEnum = pgEnum('case_status', ['open', 'in_progress', 'closed', 'on_hold']);
export const priorityEnum = pgEnum('priority', ['low', 'medium', 'high', 'urgent']);
export const interactionTypeEnum = pgEnum('interaction_type', ['call', 'email', 'meeting', 'document_review', 'court_hearing', 'consultation', 'other']);
export const followUpStatusEnum = pgEnum('follow_up_status', ['pending', 'completed', 'overdue', 'cancelled']);

// Clients table
export const clientsTable = pgTable('clients', {
  id: serial('id').primaryKey(),
  first_name: text('first_name').notNull(),
  last_name: text('last_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  company: text('company'),
  address: text('address'),
  status: clientStatusEnum('status').notNull().default('prospective'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Cases table
export const casesTable = pgTable('cases', {
  id: serial('id').primaryKey(),
  client_id: integer('client_id').notNull().references(() => clientsTable.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  status: caseStatusEnum('status').notNull().default('open'),
  priority: priorityEnum('priority').notNull().default('medium'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
  closed_at: timestamp('closed_at'),
});

// Interactions table
export const interactionsTable = pgTable('interactions', {
  id: serial('id').primaryKey(),
  client_id: integer('client_id').notNull().references(() => clientsTable.id, { onDelete: 'cascade' }),
  case_id: integer('case_id').references(() => casesTable.id, { onDelete: 'set null' }),
  type: interactionTypeEnum('type').notNull(),
  subject: text('subject').notNull(),
  notes: text('notes'),
  duration_minutes: integer('duration_minutes'),
  interaction_date: timestamp('interaction_date').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Follow-ups table
export const followUpsTable = pgTable('follow_ups', {
  id: serial('id').primaryKey(),
  client_id: integer('client_id').notNull().references(() => clientsTable.id, { onDelete: 'cascade' }),
  case_id: integer('case_id').references(() => casesTable.id, { onDelete: 'set null' }),
  title: text('title').notNull(),
  description: text('description'),
  due_date: timestamp('due_date').notNull(),
  priority: priorityEnum('priority').notNull().default('medium'),
  status: followUpStatusEnum('status').notNull().default('pending'),
  completed_at: timestamp('completed_at'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const clientsRelations = relations(clientsTable, ({ many }) => ({
  cases: many(casesTable),
  interactions: many(interactionsTable),
  followUps: many(followUpsTable),
}));

export const casesRelations = relations(casesTable, ({ one, many }) => ({
  client: one(clientsTable, {
    fields: [casesTable.client_id],
    references: [clientsTable.id],
  }),
  interactions: many(interactionsTable),
  followUps: many(followUpsTable),
}));

export const interactionsRelations = relations(interactionsTable, ({ one }) => ({
  client: one(clientsTable, {
    fields: [interactionsTable.client_id],
    references: [clientsTable.id],
  }),
  case: one(casesTable, {
    fields: [interactionsTable.case_id],
    references: [casesTable.id],
  }),
}));

export const followUpsRelations = relations(followUpsTable, ({ one }) => ({
  client: one(clientsTable, {
    fields: [followUpsTable.client_id],
    references: [clientsTable.id],
  }),
  case: one(casesTable, {
    fields: [followUpsTable.case_id],
    references: [casesTable.id],
  }),
}));

// TypeScript types for the table schemas
export type Client = typeof clientsTable.$inferSelect;
export type NewClient = typeof clientsTable.$inferInsert;
export type Case = typeof casesTable.$inferSelect;
export type NewCase = typeof casesTable.$inferInsert;
export type Interaction = typeof interactionsTable.$inferSelect;
export type NewInteraction = typeof interactionsTable.$inferInsert;
export type FollowUp = typeof followUpsTable.$inferSelect;
export type NewFollowUp = typeof followUpsTable.$inferInsert;

// Export all tables and relations for proper query building
export const tables = { 
  clients: clientsTable, 
  cases: casesTable, 
  interactions: interactionsTable, 
  followUps: followUpsTable 
};