import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ProductOperationsService } from './services/product-operations.service';
import { ProductDto } from './dtos/product.dto';
import { CreateProductDto } from './dtos/create-product.dto';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productOperationsService: ProductOperationsService,
  ) {}

  @Get()
  getAllProducts(): Promise<ProductDto[]> {
    return this.productOperationsService.findAllProducts();
  }

  @Get(':id')
  getProductById(@Param('id') id: number): Promise<ProductDto> {
    return this.productOperationsService.findProductById(id);
  }

  @Post()
  createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductDto> {
    return this.productOperationsService.createProduct(createProductDto);
  }
}
