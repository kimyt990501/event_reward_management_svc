import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../common/roles.enum';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [String], enum: Role, default: [Role.USER] })
  roles: Role[];

  @Prop({ type: Date, default: null })
  lastLoginAt: Date | null;

  @Prop({ type: Number, default: 0 })
  loginDaysCount: number;

  @Prop({ type: String, default: null })
  invited_by?: string;

  @Prop({ type: Number, default: 0 })
  invite_cnt: number;
}

export const UserSchema = SchemaFactory.createForClass(User);