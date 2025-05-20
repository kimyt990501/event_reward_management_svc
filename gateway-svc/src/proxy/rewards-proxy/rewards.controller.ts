import { Controller, Post, Get, Delete, Param, Req, Body, UseGuards } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { Role } from '../../common/roles.enum';

@Controller('api/rewards')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RewardsController {
  constructor(private readonly service: RewardsService) {}

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

  @Delete(':rewardId')
  @Roles(Role.ADMIN, Role.OPERATOR)
  remove(@Req() req, @Param('rewardId') rewardId: string) {
    return this.service.remove(req, rewardId);
  }

  @Get('/event/:eventId')
  @Roles(Role.ADMIN, Role.OPERATOR)
  findByEvent(@Req() req, @Param('eventId') eventId: string) {
    return this.service.findByEvent(req, eventId);
  }
}