import {
  IsString,
  IsNumber,
  IsArray,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';
import { Category } from '../types/types';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  price: number;

  // @IsNumber()
  // duration: number;

  // @IsNumber()
  // fileSize: number;

  // @IsString()
  // @IsUrl()
  // imageUrl: string;

  // @IsString()
  // @IsUrl()
  // fileUrl: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsEnum(Category)
  category: Category;

  @IsNumber()
  downloads: number;
}
