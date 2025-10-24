import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import type { Request } from 'express';

@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getAllProducts() {
    return this.productsService.findAll();
  }

  @Get(':id')
  getProductById(@Param('id') id: string) {
    return this.productsService.findById(id);
  }

  @Post()
  async createProduct(@Body() product: CreateProductDto, @Req() req: Request) {
    return await this.productsService.createProduct(product, req);
  }

  @Patch(':id')
  updateProduct(
    @Body() product: UpdateProductDto,
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    return this.productsService.updateProduct(product, id, req);
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.productsService.deleteProduct(id);
  }
}
