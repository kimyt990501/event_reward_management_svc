import {
  Controller,
  Post,
  Param,
  Get,
  Req,
  UseGuards,
  Inject,
  Patch,
  NotFoundException
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

  @Patch('approve/:id')
  @Roles(Role.ADMIN)
  async approveRequest(@Param('id') requestId: string) {
    const request = await this.service.findById(requestId);
    if (!request) {
      this.logger.warn(`[RequestsController] 요청 ID ${requestId}를 찾을 수 없습니다.`);
      throw new NotFoundException('요청이 존재하지 않습니다.');
    }

    if (request.status !== 'PENDING') {
      return { message: '이미 처리된 요청입니다.', status: request.status };
    }

    request.status = 'SUCCESS';
    request.approvedAt = new Date();
    await request.save();

    return { message: '보상이 승인되었습니다.' };
  }

  @Patch('reject/:id')
  @Roles(Role.ADMIN)
  async rejectRequest(@Param('id') requestId: string) {
    const request = await this.service.findById(requestId);
    if (!request) {
      this.logger.warn(`[RequestsController] 요청 ID ${requestId}를 찾을 수 없습니다.`);
      throw new NotFoundException('요청이 존재하지 않습니다.');
    }

    if (request.status !== 'PENDING') {
      return { message: '이미 처리된 요청입니다.', status: request.status };
    }

    request.status = 'FAILED';
    request.rejectedAt = new Date();
    await request.save();

    return { message: '보상이 거부되었습니다.' };
  }
}