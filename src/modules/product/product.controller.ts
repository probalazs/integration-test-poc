import {
  Controller,
  Get,
  Param,
  Put,
  Body,
  HttpCode,
  UsePipes,
} from '@nestjs/common';
import { ProductOperationsService } from './services/product-operations.service';
import { ProductDto } from './dtos/product.dto';
import { CreateProductDto } from './dtos/create-product.dto';
import { ValidationPipe } from '@nestjs/common';

@Controller('product')
@UsePipes(new ValidationPipe({ transform: true }))
export class ProductController {
  constructor(
    private readonly productOperationsService: ProductOperationsService,
  ) {}

  @Get()
  getAllProducts(): Promise<ProductDto[]> {
    return this.productOperationsService.findAllProducts();
  }

  @Get(':id')
  getProductById(@Param('id') id: string): Promise<ProductDto> {
    return this.productOperationsService.findProductById(id);
  }

  @Put()
  @HttpCode(201)
  createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductDto> {
    return this.productOperationsService.createProduct(createProductDto);
  }
}
