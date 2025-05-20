import { Controller, Post, Get, Delete, Param, Body, Req, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { Role } from '../../common/roles.enum';

@Controller('api/events')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EventsController {
  constructor(private readonly service: EventsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.OPERATOR)
  create(@Req() req, @Body() body) {
    return this.service.create(req, body);
  }

  @Get()
  @Roles(Role.ADMIN, Role.OPERATOR)
  findAll(@Req() req) {
    return this.service.findAll(req);
  }

  @Get(':eventId')
  @Roles(Role.ADMIN, Role.OPERATOR)
  findOne(@Req() req, @Param('eventId') id: string) {
    return this.service.findOne(req, id);
  }

  @Delete(':eventId')
  @Roles(Role.ADMIN, Role.OPERATOR)
  remove(@Req() req, @Param('eventId') eventId: string) {
    return this.service.remove(req, eventId);
  }
}