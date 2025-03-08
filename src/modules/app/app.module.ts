import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { config } from '../../config';
import { entities } from '../../entities';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ProductModule } from '../product/product.module';

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
  imports: [CommonModule.forRoot(connection), ProductModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
