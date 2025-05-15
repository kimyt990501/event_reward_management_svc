import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Event } from './event.schema';
import { Model } from 'mongoose';

@Injectable()
export class EventsService {
  constructor(@InjectModel(Event.name) private eventModel: Model<Event>) {}

  create(data: any) {
    return this.eventModel.create(data);
  }

  findAll() {
    return this.eventModel.find();
  }

  findById(id: string) {
    return this.eventModel.findById(id);
  }
}