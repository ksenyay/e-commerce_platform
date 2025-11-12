import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { OrderStatus } from '../types/types';
import { HydratedDocument } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class Order {
  @Prop({ type: String, required: true, enum: OrderStatus })
  status: OrderStatus;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  productId: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

// JSON transform
OrderSchema.set('toJSON', {
  transform: (doc, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
