import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  Body,
  UseGuards,
  Param,
  Query,
  Patch,
  Inject
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../common/roles.enum';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Controller()
export class ProxyController {
  constructor(private readonly httpService: HttpService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
  ) {}

  private logRequest(method: string, path: string, user: any) {
    this.logger.info(`[ProxyController] [${method}] ${path} called by user ${user?.userId || 'UNKNOWN'} (Role=${user?.roles?.join(',') || 'N/A'})`);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  @Post('/events')
  /*
   * 이벤트 등록
  */
  async createEvent(@Req() req, @Body() body, @Res() res) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(`http://event-svc:3200/events`, body, {
          headers: { Authorization: req.headers.authorization },
        }),
      );
      return res.send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      const errorResponse = err.response?.data || { message: 'Internal server error' };

      return res.status(status).json({
        statusCode: status,
        message: errorResponse.message || 'Internal server error',
        error: errorResponse.error || 'Internal Server Error',
      });
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  @Get('/events')
  /*
   * 이벤트 목록 조회
  */
  async getEvents(@Req() req, @Res() res) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`http://event-svc:3200/events/summary`, {
          headers: { Authorization: req.headers.authorization },
        }),
      );
      return res.send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      const errorResponse = err.response?.data || { message: 'Internal server error' };

      return res.status(status).json({
        statusCode: status,
        message: errorResponse.message || 'Internal server error',
        error: errorResponse.error || 'Internal Server Error',
      });
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  @Get('/events/:id')
  /*
   * 특정 이벤트 상세 조회
  */
  async getEventDetail(@Req() req, @Param('id') id: string, @Res() res) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`http://event-svc:3200/events/detail/${id}`, {
          headers: { Authorization: req.headers.authorization },
        }),
      );
      return res.send(data);
    }catch (err) {
      const status = err.response?.status || 500;
      const errorResponse = err.response?.data || { message: 'Internal server error' };

      return res.status(status).json({
        statusCode: status,
        message: errorResponse.message || 'Internal server error',
        error: errorResponse.error || 'Internal Server Error',
      });
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Post('/requests/:eventId')
  /*
   * 특정 이벤트에 대해 보상 요청
  */
  async requestReward(@Req() req, @Param('eventId') id: string, @Res() res) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(`http://event-svc:3200/requests/${id}`, {}, {
          headers: { Authorization: req.headers.authorization },
        }),
      );
      return res.send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      const errorResponse = err.response?.data || { message: 'Internal server error' };

      return res.status(status).json({
        statusCode: status,
        message: errorResponse.message || 'Internal server error',
        error: errorResponse.error || 'Internal Server Error',
      });
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.AUDITOR, Role.ADMIN, Role.OPERATOR)
  @Get('/requests')
  /*
   * 보상 요청 내역 확인
  */
  async getRequests(@Req() req, @Res() res) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`http://event-svc:3200/requests`, {
          headers: { Authorization: req.headers.authorization },
        }),
      );
      return res.send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      const errorResponse = err.response?.data || { message: 'Internal server error' };

      return res.status(status).json({
        statusCode: status,
        message: errorResponse.message || 'Internal server error',
        error: errorResponse.error || 'Internal Server Error',
      });
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  @Post('/rewards')
  /*
  * 보상 등록
  */
  async createReward(@Req() req, @Body() body, @Res() res) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(`http://event-svc:3200/rewards`, body, {
          headers: { Authorization: req.headers.authorization },
        }),
      );
      return res.send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      const errorResponse = err.response?.data || { message: 'Internal server error' };

      return res.status(status).json({
        statusCode: status,
        message: errorResponse.message || 'Internal server error',
        error: errorResponse.error || 'Internal Server Error',
      });
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  @Get('/rewards')
  /*
   * 보상 조회
  */
  async getAllRewards(@Req() req, @Res() res) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`http://event-svc:3200/rewards`, {
          headers: { Authorization: req.headers.authorization },
        }),
      );
      return res.send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      const errorResponse = err.response?.data || { message: 'Internal server error' };

      return res.status(status).json({
        statusCode: status,
        message: errorResponse.message || 'Internal server error',
        error: errorResponse.error || 'Internal Server Error',
      });
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  @Get('/rewards/event/:eventId')
  /*
   * 특정 이벤트에 대한 보상 조회
  */
  async getRewardsByEvent(@Req() req, @Param('eventId') eventId: string, @Res() res) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`http://event-svc:3200/rewards/event/${eventId}`, {
          headers: { Authorization: req.headers.authorization },
        }),
      );
      return res.send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      const errorResponse = err.response?.data || { message: 'Internal server error' };

      return res.status(status).json({
        statusCode: status,
        message: errorResponse.message || 'Internal server error',
        error: errorResponse.error || 'Internal Server Error',
      });
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('/requests/approve/:id')
  /*
  * 보상 요청 승인 처리 (관리자용)
  */
  async approveRequest(@Req() req, @Param('id') id: string, @Res() res) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.patch(`http://event-svc:3200/requests/approve/${id}`, {}, {
          headers: { Authorization: req.headers.authorization },
        }),
      );
      return res.send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      const errorResponse = err.response?.data || { message: 'Internal server error' };

      return res.status(status).json({
        statusCode: status,
        message: errorResponse.message || 'Internal server error',
        error: errorResponse.error || 'Internal Server Error',
      });
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('/requests/reject/:id')
  /*
  * 보상 요청 거부 처리 (관리자용)
  */
  async rejectRequest(@Req() req, @Param('id') id: string, @Res() res) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.patch(`http://event-svc:3200/requests/reject/${id}`, {}, {
          headers: { Authorization: req.headers.authorization },
        }),
      );
      return res.send(data);
    } catch (err) {
      const status = err.response?.status || 500;
      const errorResponse = err.response?.data || { message: 'Internal server error' };

      return res.status(status).json({
        statusCode: status,
        message: errorResponse.message || 'Internal server error',
        error: errorResponse.error || 'Internal Server Error',
      });
    }
  }
}