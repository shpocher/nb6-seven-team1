import { PrismaClient } from '@prisma/client';

const isProduction = process.env.NODE_ENV === 'production';
const shouldLogQuery = process.env.PRISMA_QUERY_LOG === 'true';

// production: only error logs, non-prod: info/warn/error
const logLevels = isProduction ? ['error'] : ['info', 'warn', 'error'];

// enable query logs only when explicitly requested
if (!isProduction && shouldLogQuery) {
  logLevels.unshift('query');
}

const prisma = new PrismaClient({
  log: logLevels,
});

export default prisma;
