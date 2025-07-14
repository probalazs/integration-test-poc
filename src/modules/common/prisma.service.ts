import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { PRISMA_OPTIONS } from './common.module';
import { Prisma, PrismaClient } from '../../prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(@Inject(PRISMA_OPTIONS) options: Prisma.PrismaClientOptions) {
    super(options);
  }

  async onModuleInit() {
    await this.$connect();
  }
}
