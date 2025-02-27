import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions.js';

export const getStartedContainer: () => Promise<StartedPostgreSqlContainer> =
  (() => {
    const container = new PostgreSqlContainer();
    const started = container.start();
    return () => started;
  })();

export const getConnectionOptions: () => Promise<PostgresConnectionOptions> =
  (() => {
    const config = getStartedContainer().then(
      (started) =>
        ({
          type: 'postgres',
          host: started.getHost(),
          port: started.getPort(),
          username: started.getUsername(),
          password: started.getPassword(),
          database: started.getDatabase(),
        }) as PostgresConnectionOptions,
    );
    return () => config;
  })();

export async function initContainer(): Promise<void> {
  await getConnectionOptions();
}

export async function stopContainer(): Promise<void> {
  const started = await getStartedContainer();
  await started.stop();
}
