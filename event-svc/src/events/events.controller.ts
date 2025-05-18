import { Controller, Post, Body, Get, UseGuards, Param, Delete } from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../common/roles.enum';

@Controller('events')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EventsController {
  constructor(private readonly service: EventsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.OPERATOR)
  create(@Body() body) {
    return this.service.create(body);
  }

  @Get('summary')
  async getEventsSummary() {
    return this.service.findAllSummary();
  }

  @Get('detail/:id')
  async getEventDetail(@Param('id') id: string) {
    return this.service.findDetailById(id);
  }

  @Delete(':eventId')
  @Roles(Role.ADMIN, Role.OPERATOR)
  async deleteEvent(@Param('eventId') eventId: string) {
    return this.service.deleteById(eventId);
  }
}