import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CommonModule } from '../common/common.module';
import { config } from '../../config';
import { entities } from '../../entities';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const connection: TypeOrmModuleOptions = {
  type: 'postgres',
  host: config.pgHost,
  port: config.pgPort,
  username: config.pgUser,
  password: config.pgPassword,
  database: config.pgDb,
  entities,
};

@Module({
  imports: [CommonModule.forRoot(connection)],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
