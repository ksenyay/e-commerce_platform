import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

export type Category =
  | 'nature'
  | 'urban'
  | 'noise'
  | 'seasonal'
  | 'meditation'
  | 'instrumental';

@Schema()
export class Product {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  price: number;

  // @Prop({ required: true })
  // duration: number;

  // @Prop({ required: true })
  // fileSize: number;

  // @Prop({ required: true })
  // imageUrl: string;

  // @Prop({ required: true })
  // fileUrl: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({
    required: true,
    enum: [
      'nature',
      'urban',
      'noise',
      'seasonal',
      'meditation',
      'instrumental',
    ],
  })
  category: Category;

  @Prop({ default: 0 })
  downloads: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// define the JSON transform here
ProductSchema.set('toJSON', {
  transform: (doc, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
