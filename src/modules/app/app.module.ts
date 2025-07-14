import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { Config, config } from '../../config';
import { entities } from '../../entities';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ProductModule } from '../product/product.module';
import { Prisma } from '../../prisma/client';

const connection: TypeOrmModuleOptions = {
  type: 'postgres',
  host: config.pgHost,
  port: config.pgPort,
  username: config.pgUser,
  password: config.pgPassword,
  database: config.pgDb,
  entities,
};

const prismaOptions: Prisma.PrismaClientOptions = {
  datasources: {
    db: {
      url: getConnectionString(config),
    },
  },
};

function getConnectionString(config: Config): string {
  return `postgresql://${config.pgUser}:${config.pgPassword}@${config.pgHost}:${config.pgPort}/${config.pgDb}?schema=${config.pgSchema}`;
}

@Module({
  imports: [CommonModule.forRoot(connection, prismaOptions), ProductModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
