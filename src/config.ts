import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

export type Config = {
  readonly pgHost: string;
  readonly pgPort: number;
  readonly pgUser: string;
  readonly pgPassword: string;
  readonly pgDb: string;
};

export const config: Config = {
  pgHost: process.env.PG_HOST!,
  pgPort: parseInt(process.env.PG_PORT!, 10),
  pgUser: process.env.PG_USER!,
  pgPassword: process.env.PG_PASSWORD!,
  pgDb: process.env.PG_DB!,
};
