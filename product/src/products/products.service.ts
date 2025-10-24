import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from '../db/schemas/product.schema';
import { Model } from 'mongoose';
import type { Request } from 'express';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private products: Model<Product>,
    @Inject('PRODUCT_RABBITMQ_SERVICE')
    private readonly productClient: ClientProxy,
  ) {}

  async findAll() {
    return await this.products.find().exec();
  }

  async findById(id: string) {
    const product = await this.products.findById(id).exec();

    if (!product) {
      throw new NotFoundException();
    }

    return product;
  }

  async createProduct(product: CreateProductDto, req: Request) {
    const newProduct = new this.products({
      ...product,
      userId: req.currentUser!.id,
    });

    // Emit product creation event
    this.productClient.emit('product.created', {
      id: newProduct.id,
      title: newProduct.title,
      price: newProduct.price,
      userId: newProduct.userId,
    });

    return await newProduct.save();
  }

  async updateProduct(product: UpdateProductDto, id: string, req: Request) {
    const updatedProduct = await this.products
      .findByIdAndUpdate(id, product, { new: true })
      .exec();

    if (!updatedProduct) {
      throw new NotFoundException();
    }

    if (req.currentUser!.id !== updatedProduct.userId) {
      throw new UnauthorizedException();
    }

    this.productClient.emit('product.updated', {
      id: updatedProduct.id,
      title: updatedProduct.title,
      price: updatedProduct.price,
      userId: updatedProduct.userId,
    });

    return updatedProduct;
  }

  async deleteProduct(id: string) {
    const product = await this.products.findByIdAndDelete(id).exec();
    return product;
  }
}
