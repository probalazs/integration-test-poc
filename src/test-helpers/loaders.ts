import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { TestPostgresConnectionOptions } from './types';

export async function startPostgres() {
  if (process.env.__TEST_POSTGRES_CONTAINER) {
    return;
  }
  const started = await getStartedContainer();
  (global as any).__TEST_POSTGRES_CONTAINER = started;
  setConnectionOptions(started);
}

function setConnectionOptions(started: StartedPostgreSqlContainer) {
  const connectionOptions = getConnectionOptions(started);
  process.env.__TEST_POSTGRES_CONNECTION_OPTIONS =
    JSON.stringify(connectionOptions);
}

function getStartedContainer(): Promise<StartedPostgreSqlContainer> {
  return new PostgreSqlContainer().start();
}

function getConnectionOptions(
  started: StartedPostgreSqlContainer,
): TestPostgresConnectionOptions {
  return {
    host: started.getHost(),
    port: started.getPort(),
    username: started.getUsername(),
    password: started.getPassword(),
    database: started.getDatabase(),
  };
}

export async function stopPostgres() {
  if (!process.env.__TEST_POSTGRES_CONTAINER) {
    return;
  }
  await stopContainer();
  clearConnectionOptions();
}

async function stopContainer() {
  const container = (global as any).__TEST_POSTGRES_CONTAINER;
  await container.stop();
  delete (global as any).__TEST_POSTGRES_CONTAINER;
}

function clearConnectionOptions() {
  delete process.env.__TEST_POSTGRES_CONNECTION_OPTIONS;
}
