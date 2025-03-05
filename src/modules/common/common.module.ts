import { Module, Global, DynamicModule } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Global()
@Module({})
export class CommonModule {
  static forRoot(typeOrmOptions: TypeOrmModuleOptions): DynamicModule {
    return {
      module: CommonModule,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      imports: [TypeOrmModule.forRoot(typeOrmOptions)],
    };
  }
}
