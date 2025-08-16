import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';

// Import schemas
import { 
  createClientInputSchema, 
  getClientByIdInputSchema,
  updateClientInputSchema,
  createCaseInputSchema,
  getCasesByClientInputSchema,
  updateCaseInputSchema,
  createInteractionInputSchema,
  getInteractionsByClientInputSchema,
  updateInteractionInputSchema,
  createFollowUpInputSchema,
  getFollowUpsByClientInputSchema,
  updateFollowUpInputSchema,
  markFollowUpCompleteInputSchema
} from './schema';

// Import handlers
import { createClient } from './handlers/create_client';
import { getClients } from './handlers/get_clients';
import { getClientById } from './handlers/get_client_by_id';
import { updateClient } from './handlers/update_client';
import { createCase } from './handlers/create_case';
import { getCasesByClient } from './handlers/get_cases_by_client';
import { updateCase } from './handlers/update_case';
import { createInteraction } from './handlers/create_interaction';
import { getInteractionsByClient } from './handlers/get_interactions_by_client';
import { updateInteraction } from './handlers/update_interaction';
import { createFollowUp } from './handlers/create_follow_up';
import { getFollowUpsByClient } from './handlers/get_follow_ups_by_client';
import { getPendingFollowUps } from './handlers/get_pending_follow_ups';
import { markFollowUpComplete } from './handlers/mark_follow_up_complete';
import { updateFollowUp } from './handlers/update_follow_up';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Client management routes
  createClient: publicProcedure
    .input(createClientInputSchema)
    .mutation(({ input }) => createClient(input)),
  
  getClients: publicProcedure
    .query(() => getClients()),
  
  getClientById: publicProcedure
    .input(getClientByIdInputSchema)
    .query(({ input }) => getClientById(input)),
  
  updateClient: publicProcedure
    .input(updateClientInputSchema)
    .mutation(({ input }) => updateClient(input)),

  // Case management routes
  createCase: publicProcedure
    .input(createCaseInputSchema)
    .mutation(({ input }) => createCase(input)),
  
  getCasesByClient: publicProcedure
    .input(getCasesByClientInputSchema)
    .query(({ input }) => getCasesByClient(input)),
  
  updateCase: publicProcedure
    .input(updateCaseInputSchema)
    .mutation(({ input }) => updateCase(input)),

  // Interaction tracking routes
  createInteraction: publicProcedure
    .input(createInteractionInputSchema)
    .mutation(({ input }) => createInteraction(input)),
  
  getInteractionsByClient: publicProcedure
    .input(getInteractionsByClientInputSchema)
    .query(({ input }) => getInteractionsByClient(input)),
  
  updateInteraction: publicProcedure
    .input(updateInteractionInputSchema)
    .mutation(({ input }) => updateInteraction(input)),

  // Follow-up management routes
  createFollowUp: publicProcedure
    .input(createFollowUpInputSchema)
    .mutation(({ input }) => createFollowUp(input)),
  
  getFollowUpsByClient: publicProcedure
    .input(getFollowUpsByClientInputSchema)
    .query(({ input }) => getFollowUpsByClient(input)),
  
  getPendingFollowUps: publicProcedure
    .query(() => getPendingFollowUps()),
  
  markFollowUpComplete: publicProcedure
    .input(markFollowUpCompleteInputSchema)
    .mutation(({ input }) => markFollowUpComplete(input)),
  
  updateFollowUp: publicProcedure
    .input(updateFollowUpInputSchema)
    .mutation(({ input }) => updateFollowUp(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC CRM server listening at port: ${port}`);
}

start();