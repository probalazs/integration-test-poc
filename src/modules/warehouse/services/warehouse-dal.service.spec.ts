import { createMock } from '@golevelup/ts-jest';
import { WarehouseDalService } from './warehouse-dal.service';
import { prismaPostgresDecorator } from '../../../test-helpers/decorators';
import { PrismaService } from '../../../modules/common/prisma.service';
import { PrismaClient, Warehouse } from '../../../prisma/client';
import { createWarehouse } from '../test-data-factory';

describe('WarehouseDalService', () => {
  describe('findAll', () => {
    it(
      'should return empty array if no warehouses exist',
      prismaPostgresDecorator(async ({ prismaPostgres }) => {
        const service = createService({ prisma: prismaPostgres as any });

        const products = await service.findAll();

        expect(products).toEqual([]);
      }),
    );

    it(
      'should return all warehouses',
      prismaPostgresDecorator(async ({ prismaPostgres }) => {
        const service = createService({ prisma: prismaPostgres as any });

        const warehouses = [createWarehouse(), createWarehouse()];
        await addWarehouses(prismaPostgres, warehouses);

        const result = await service.findAll();

        expect(result).toEqual(warehouses);
      }),
    );
  });
});

function createService({
  prisma = createMock<PrismaService>(),
}: Partial<{ prisma: PrismaService }> = {}) {
  return new WarehouseDalService(prisma);
}

async function addWarehouses(prisma: PrismaClient, warehouses: Warehouse[]) {
  await prisma.warehouse.createMany({
    data: warehouses,
  });
}
