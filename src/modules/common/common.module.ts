import { Module, Global, DynamicModule } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Global()
@Module({})
export class CommonModule {
  static forRoot(typeOrmOptions: TypeOrmModuleOptions): DynamicModule {
    return {
      module: CommonModule,
      imports: [TypeOrmModule.forRoot(typeOrmOptions)],
    };
  }
}
