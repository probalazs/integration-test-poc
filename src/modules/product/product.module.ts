import { Module } from '@nestjs/common';
import { ProductDalService } from './services/product-dal.service';
import { ProductOperationsService } from './services/product-operations.service';
@Module({
  controllers: [],
  providers: [ProductDalService, ProductOperationsService],
})
export class ProductModule {}
