import { Module, Global, DynamicModule } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { PrismaService } from './prisma.service';
import { Prisma } from '../../prisma/client';

export const PRISMA_OPTIONS = 'PRISMA_OPTIONS';

@Global()
@Module({})
export class CommonModule {
  static forRoot(
    typeOrmOptions: TypeOrmModuleOptions,
    prismaOptions: Prisma.PrismaClientOptions,
  ): DynamicModule {
    return {
      module: CommonModule,
      imports: [TypeOrmModule.forRoot(typeOrmOptions)],
      providers: [
        {
          provide: PRISMA_OPTIONS,
          useValue: prismaOptions,
        },
        PrismaService,
      ],
    };
  }
}
