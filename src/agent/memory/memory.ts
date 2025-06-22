import { PostgresSaver } from '@langchain/langgraph-checkpoint-postgres';
import * as dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'test') {
  dotenv.config();
}

/**
 * Creates a PostgresSaver instance using environment variables
 * @returns PostgresSaver instance
 */
export function createPostgresMemory(): PostgresSaver {
  const host = process.env.DB_HOST || 'localhost';
  const port = process.env.DB_PORT || '5433';
  const username = process.env.DB_USERNAME || 'postgres';
  const password = process.env.DB_PASSWORD || 'postgres';
  const dbName = process.env.DB_NAME || 'agent_db';

  const connectionString = `postgresql://${username}:${password}@${host}:${port}/${dbName}${
    process.env.DB_SSLMODE ? `?sslmode=${process.env.DB_SSLMODE}` : ''
  }`;

  return PostgresSaver.fromConnString(connectionString);
}

export const postgresCheckpointer = createPostgresMemory();
