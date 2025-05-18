import { Controller, Post, Body, UseGuards, Get, Param, Delete } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../common/roles.enum';

@Controller('rewards')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RewardsController {
  constructor(private readonly service: RewardsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.OPERATOR)
  create(@Body() body) {
    return this.service.create(body);
  }

  @Get()
  @Roles(Role.ADMIN, Role.OPERATOR)
  async findAll() {
    return this.service.findAll();
  }

  @Get('event/:eventId')
  @Roles(Role.ADMIN, Role.OPERATOR)
  async findByEvent(@Param('eventId') eventId: string) {
    return this.service.findByEvent(eventId);
  }

  @Delete(':rewardId')
  @Roles(Role.ADMIN, Role.OPERATOR)
  async deleteReward(@Param('rewardId') rewardId: string) {
    return this.service.deleteById(rewardId);
  }
}