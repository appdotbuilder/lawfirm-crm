import { z } from 'zod';

// Client schema
export const clientSchema = z.object({
  id: z.number(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
  phone: z.string().nullable(),
  company: z.string().nullable(),
  address: z.string().nullable(),
  status: z.enum(['active', 'inactive', 'prospective']),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Client = z.infer<typeof clientSchema>;

// Input schema for creating clients
export const createClientInputSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().nullable(),
  company: z.string().nullable(),
  address: z.string().nullable(),
  status: z.enum(['active', 'inactive', 'prospective']).default('prospective')
});

export type CreateClientInput = z.infer<typeof createClientInputSchema>;

// Input schema for updating clients
export const updateClientInputSchema = z.object({
  id: z.number(),
  first_name: z.string().min(1).optional(),
  last_name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().nullable().optional(),
  company: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  status: z.enum(['active', 'inactive', 'prospective']).optional()
});

export type UpdateClientInput = z.infer<typeof updateClientInputSchema>;

// Case schema
export const caseSchema = z.object({
  id: z.number(),
  client_id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  status: z.enum(['open', 'in_progress', 'closed', 'on_hold']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  closed_at: z.coerce.date().nullable()
});

export type Case = z.infer<typeof caseSchema>;

// Input schema for creating cases
export const createCaseInputSchema = z.object({
  client_id: z.number().positive(),
  title: z.string().min(1, 'Case title is required'),
  description: z.string().nullable(),
  status: z.enum(['open', 'in_progress', 'closed', 'on_hold']).default('open'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium')
});

export type CreateCaseInput = z.infer<typeof createCaseInputSchema>;

// Input schema for updating cases
export const updateCaseInputSchema = z.object({
  id: z.number(),
  title: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  status: z.enum(['open', 'in_progress', 'closed', 'on_hold']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional()
});

export type UpdateCaseInput = z.infer<typeof updateCaseInputSchema>;

// Interaction schema
export const interactionSchema = z.object({
  id: z.number(),
  client_id: z.number(),
  case_id: z.number().nullable(),
  type: z.enum(['call', 'email', 'meeting', 'document_review', 'court_hearing', 'consultation', 'other']),
  subject: z.string(),
  notes: z.string().nullable(),
  duration_minutes: z.number().int().nullable(),
  interaction_date: z.coerce.date(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Interaction = z.infer<typeof interactionSchema>;

// Input schema for creating interactions
export const createInteractionInputSchema = z.object({
  client_id: z.number().positive(),
  case_id: z.number().positive().nullable(),
  type: z.enum(['call', 'email', 'meeting', 'document_review', 'court_hearing', 'consultation', 'other']),
  subject: z.string().min(1, 'Subject is required'),
  notes: z.string().nullable(),
  duration_minutes: z.number().int().positive().nullable(),
  interaction_date: z.coerce.date()
});

export type CreateInteractionInput = z.infer<typeof createInteractionInputSchema>;

// Input schema for updating interactions
export const updateInteractionInputSchema = z.object({
  id: z.number(),
  type: z.enum(['call', 'email', 'meeting', 'document_review', 'court_hearing', 'consultation', 'other']).optional(),
  subject: z.string().min(1).optional(),
  notes: z.string().nullable().optional(),
  duration_minutes: z.number().int().positive().nullable().optional(),
  interaction_date: z.coerce.date().optional()
});

export type UpdateInteractionInput = z.infer<typeof updateInteractionInputSchema>;

// Follow-up schema
export const followUpSchema = z.object({
  id: z.number(),
  client_id: z.number(),
  case_id: z.number().nullable(),
  title: z.string(),
  description: z.string().nullable(),
  due_date: z.coerce.date(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  status: z.enum(['pending', 'completed', 'overdue', 'cancelled']),
  completed_at: z.coerce.date().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type FollowUp = z.infer<typeof followUpSchema>;

// Input schema for creating follow-ups
export const createFollowUpInputSchema = z.object({
  client_id: z.number().positive(),
  case_id: z.number().positive().nullable(),
  title: z.string().min(1, 'Follow-up title is required'),
  description: z.string().nullable(),
  due_date: z.coerce.date(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium')
});

export type CreateFollowUpInput = z.infer<typeof createFollowUpInputSchema>;

// Input schema for updating follow-ups
export const updateFollowUpInputSchema = z.object({
  id: z.number(),
  title: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  due_date: z.coerce.date().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  status: z.enum(['pending', 'completed', 'overdue', 'cancelled']).optional()
});

export type UpdateFollowUpInput = z.infer<typeof updateFollowUpInputSchema>;

// Query parameter schemas
export const getClientByIdInputSchema = z.object({
  id: z.number().positive()
});

export type GetClientByIdInput = z.infer<typeof getClientByIdInputSchema>;

export const getCasesByClientInputSchema = z.object({
  client_id: z.number().positive()
});

export type GetCasesByClientInput = z.infer<typeof getCasesByClientInputSchema>;

export const getInteractionsByClientInputSchema = z.object({
  client_id: z.number().positive()
});

export type GetInteractionsByClientInput = z.infer<typeof getInteractionsByClientInputSchema>;

export const getFollowUpsByClientInputSchema = z.object({
  client_id: z.number().positive()
});

export type GetFollowUpsByClientInput = z.infer<typeof getFollowUpsByClientInputSchema>;

export const markFollowUpCompleteInputSchema = z.object({
  id: z.number().positive()
});

export type MarkFollowUpCompleteInput = z.infer<typeof markFollowUpCompleteInputSchema>;