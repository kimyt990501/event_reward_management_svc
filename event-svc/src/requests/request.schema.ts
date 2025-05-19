import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Request extends Document {
  @Prop({ required: true })
  userEmail: string;

  @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
  eventId: Types.ObjectId;

  @Prop({ required: true })
  eventTitle: string;

  @Prop({ default: 'PENDING' })
  status: 'PENDING' | 'SUCCESS' | 'FAILED';

  @Prop()
  requestedAt: Date;

  @Prop()
  approvedAt?: Date;

  @Prop()
  rejectedAt?: Date;
}

export const RequestSchema = SchemaFactory.createForClass(Request);