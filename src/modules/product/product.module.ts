import { Module } from '@nestjs/common';
import { ProductDalService } from './services/product-dal.service';
import { ProductOperationsService } from './services/product-operations.service';
import { ProductController } from './product.controller';

@Module({
  controllers: [ProductController],
  providers: [ProductDalService, ProductOperationsService],
})
export class ProductModule {}
