import {
  Controller,
  Post,
  Param,
  Get,
  Req,
  UseGuards,
  Inject
} from '@nestjs/common';
import { RequestsService } from './requests.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../common/roles.enum';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Controller('requests')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RequestsController {
  constructor(private readonly service: RequestsService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Post(':eventId')
  @Roles(Role.USER)
  async request(@Param('eventId') id: string, @Req() req) {
    this.logger.log(`[RequestsController] User ${req.user?.userId} is requesting reward for event ${id}`, 'info');
    this.logger.log(`req.user: ${JSON.stringify(req.user)}`, 'debug');
    this.logger.log(`eventId param: ${id}`, 'debug');
    return this.service.requestReward(req.user?.userId, id);
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