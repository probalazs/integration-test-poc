import { Module } from '@nestjs/common';
import { ProductDalService } from './services/product-dal.service';

@Module({
  controllers: [],
  providers: [ProductDalService],
})
export class ProductModule {}
