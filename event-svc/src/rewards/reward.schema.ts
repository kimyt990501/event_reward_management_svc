import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Reward extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  type: string;

  @Prop()
  quantity: number;

  @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
  eventId: Types.ObjectId;
}

export const RewardSchema = SchemaFactory.createForClass(Reward);