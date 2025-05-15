import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Request, RequestSchema } from './request.schema';
import { Event, EventSchema } from '../events/event.schema';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { EventsService } from '../events/events.service';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Request.name, schema: RequestSchema }]),
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    EventsModule,
  ],
  controllers: [RequestsController],
  providers: [RequestsService, EventsService],
  exports: [RequestsService],
})
export class RequestsModule {}