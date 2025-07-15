export type TestPostgresConnectionOptions = {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
};

export type PrismaClientSkeleton = {
  $connect: () => Promise<void>;
  $disconnect: () => Promise<void>;
  $executeRawUnsafe: (query: string) => Promise<number>;
};
