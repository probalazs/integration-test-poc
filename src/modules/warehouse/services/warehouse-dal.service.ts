import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { Warehouse } from '../../../prisma/client';

@Injectable()
export class WarehouseDalService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<Warehouse[]> {
    return this.prisma.warehouse.findMany();
  }
}
