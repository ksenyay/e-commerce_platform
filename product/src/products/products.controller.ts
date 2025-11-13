import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto';
import type { Request } from 'express';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import multer from 'multer';
import { StorageService } from '../storage/storage.service';

@Controller('api/products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly storageService: StorageService,
  ) {}

  @Get()
  getAllProducts(
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.productsService.findAll(category, search, page, limit);
  }

  @Get(':id')
  getProductById(@Param('id') id: string) {
    return this.productsService.findById(id);
  }

  @Get('my-products/:id')
  findByUserId(@Param('id') id: string) {
    return this.productsService.findByUserId(id);
  }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'file', maxCount: 1 },
      ],
      { storage: multer.memoryStorage() },
    ),
  )
  async createProduct(
    @Body() product: CreateProductDto,
    @Req() req: Request,
    @UploadedFiles()
    files: { image?: Express.Multer.File[]; file?: Express.Multer.File[] },
  ) {
    const uploadedFiles: any = {};

    if (files.image) {
      uploadedFiles.imageUrl = await this.storageService.uploadFile(
        files.image[0],
        'images/',
      );
    }

    if (files.file) {
      uploadedFiles.fileUrl = await this.storageService.uploadFile(
        files.file[0],
        'files/',
      );
    }

    return await this.productsService.createProduct(
      product,
      req,
      uploadedFiles,
    );
  }

  @Patch('/downloads/:id')
  updateDownload(@Param('id') id: string) {
    return this.productsService.updateDownload(id);
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.productsService.deleteProduct(id);
  }

  // @Patch(':id')
  // updateProduct(
  //   @Body() product: UpdateProductDto,
  //   @Param('id') id: string,
  //   @Req() req: Request,
  // ) {
  //   return this.productsService.updateProduct(product, id, req);
  // }
}
