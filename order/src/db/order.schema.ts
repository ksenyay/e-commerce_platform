import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class Order {
  @Prop()
  userId: string;

  @Prop()
  status: string;

  @Prop()
  expiresAt: string;

  @Prop()
  productId: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

// defining the JSON transform
OrderSchema.set('toJSON', {
  transform: (doc, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
