import { Controller, Post, Get, Patch, Param, Req, Query, UseGuards } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { Role } from '../../common/roles.enum';

@Controller('api/requests')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RequestsController {
  constructor(private readonly service: RequestsService) {}

  @Post(':eventId')
  @Roles(Role.USER, Role.ADMIN)
  requestReward(@Req() req, @Param('eventId') eventId: string) {
    return this.service.requestReward(req, eventId);
  }

  @Get()
  @Roles(Role.AUDITOR, Role.ADMIN, Role.OPERATOR)
  getRequests(@Req() req, @Query() query) {
    return this.service.getRequests(req, query);
  }

  @Patch('/approve/:id')
  @Roles(Role.ADMIN, Role.OPERATOR)
  approve(@Req() req, @Param('id') id: string) {
    return this.service.approve(req, id);
  }

  @Patch('/reject/:id')
  @Roles(Role.ADMIN, Role.OPERATOR)
  reject(@Req() req, @Param('id') id: string) {
    return this.service.reject(req, id);
  }

  @Get('/my')
  @Roles(Role.USER, Role.ADMIN)
  myRequests(@Req() req) {
    return this.service.myRequests(req);
  }
}