import {
  Controller,
  Post,
  Param,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RequestsService } from './requests.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../common/roles.enum';

@Controller('requests')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RequestsController {
  constructor(private readonly service: RequestsService) {}

  @Post(':eventId')
  @Roles(Role.USER)
  async request(@Param('eventId') id: string, @Req() req) {
    return this.service.requestReward(req.user.userId, id);
  }

  @Get('my')
  @Roles(Role.USER)
  async my(@Req() req) {
    return this.service.findByUser(req.user.userId);
  }

  @Get()
  @Roles(Role.ADMIN, Role.OPERATOR, Role.AUDITOR)
  async all() {
    return this.service.findAll();
  }
}