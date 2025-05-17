import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  Body,
  UseGuards,
  Param,
  Patch,
  HttpException
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../common/roles.enum';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Controller('api')
export class ProxyController {
  constructor(private readonly httpService: HttpService,) {}

  @UseGuards()
  @Post('/login')
  async login(@Body() body) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(`http://auth-svc:3100/auth/login`, body),
      );
      return data;
    } catch (err) {
      const status = err.response?.status || 500;
      const errorResponse = err.response?.data || { message: 'Internal server error' };

      throw new HttpException({
        message: errorResponse.message || 'Internal server error',
        error: errorResponse.error || 'Internal Server Error',
      }, status);
    }
  }

  @UseGuards()
  @Post('/register')
  async register(@Body() body) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(`http://auth-svc:3100/auth/register`, body),
      );
      return data;
    } catch (err) {
      const status = err.response?.status || 500;
      const errorResponse = err.response?.data || { message: 'Internal server error' };

      throw new HttpException({
        message: errorResponse.message || 'Internal server error',
        error: errorResponse.error || 'Internal Server Error',
      }, status);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  @Post('/events')
  /*
   * 이벤트 등록
  */
  async createEvent(@Req() req, @Body() body) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(`http://event-svc:3200/events`, body, {
          headers: { Authorization: req.headers.authorization },
        }),
      );
      return data;
    } catch (err) {
      const status = err.response?.status || 500;
      const errorResponse = err.response?.data || { message: 'Internal server error' };

      throw new HttpException({
        message: errorResponse.message || 'Internal server error',
        error: errorResponse.error || 'Internal Server Error',
      }, status);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  @Get('/events')
  /*
   * 이벤트 목록 조회
  */
  async getEvents(@Req() req) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`http://event-svc:3200/events/summary`, {
          headers: { Authorization: req.headers.authorization },
        }),
      );
      return data;
    } catch (err) {
      const status = err.response?.status || 500;
      const errorResponse = err.response?.data || { message: 'Internal server error' };

      throw new HttpException({
        message: errorResponse.message || 'Internal server error',
        error: errorResponse.error || 'Internal Server Error',
      }, status);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  @Get('/events/:id')
  /*
   * 특정 이벤트 상세 조회
  */
  async getEventDetail(@Req() req, @Param('id') id: string) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`http://event-svc:3200/events/detail/${id}`, {
          headers: { Authorization: req.headers.authorization },
        }),
      );
      return data;
    } catch (err) {
      const status = err.response?.status || 500;
      const errorResponse = err.response?.data || { message: 'Internal server error' };

      throw new HttpException({
        message: errorResponse.message || 'Internal server error',
        error: errorResponse.error || 'Internal Server Error',
      }, status);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Post('/requests/:eventId')
  /*
   * 특정 이벤트에 대해 보상 요청
  */
  async requestReward(@Req() req, @Param('eventId') id: string) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(`http://event-svc:3200/requests/${id}`, {}, {
          headers: { Authorization: req.headers.authorization },
        }),
      );
      return data;
    } catch (err) {
      const status = err.response?.status || 500;
      const errorResponse = err.response?.data || { message: 'Internal server error' };

      throw new HttpException({
        message: errorResponse.message || 'Internal server error',
        error: errorResponse.error || 'Internal Server Error',
      }, status);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.AUDITOR, Role.ADMIN, Role.OPERATOR)
  @Get('/requests')
  /*
   * 보상 요청 내역 확인
  */
  async getRequests(@Req() req) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`http://event-svc:3200/requests`, {
          headers: { Authorization: req.headers.authorization },
        }),
      );
      return data;
    } catch (err) {
      const status = err.response?.status || 500;
      const errorResponse = err.response?.data || { message: 'Internal server error' };

      throw new HttpException({
        message: errorResponse.message || 'Internal server error',
        error: errorResponse.error || 'Internal Server Error',
      }, status);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  @Post('/rewards')
  /*
  * 보상 등록
  */
  async createReward(@Req() req, @Body() body) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(`http://event-svc:3200/rewards`, body, {
          headers: { Authorization: req.headers.authorization },
        }),
      );
      return data;
    } catch (err) {
      const status = err.response?.status || 500;
      const errorResponse = err.response?.data || { message: 'Internal server error' };

      throw new HttpException({
        message: errorResponse.message || 'Internal server error',
        error: errorResponse.error || 'Internal Server Error',
      }, status);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  @Get('/rewards')
  /*
   * 보상 조회
  */
  async getAllRewards(@Req() req) {
  try {
      const { data } = await firstValueFrom(
        this.httpService.get(`http://event-svc:3200/rewards`, {
          headers: { Authorization: req.headers.authorization },
        }),
      );
      return data;
    } catch (err) {
      const status = err.response?.status || 500;
      const errorResponse = err.response?.data || { message: 'Internal server error' };

      throw new HttpException({
        message: errorResponse.message || 'Internal server error',
        error: errorResponse.error || 'Internal Server Error',
      }, status);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  @Get('/rewards/event/:eventId')
  /*
   * 특정 이벤트에 대한 보상 조회
  */
  async getRewardsByEvent(@Req() req, @Param('eventId') eventId: string) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`http://event-svc:3200/rewards/event/${eventId}`, {
          headers: { Authorization: req.headers.authorization },
        }),
      );
      return data;
    } catch (err) {
      const status = err.response?.status || 500;
      const errorResponse = err.response?.data || { message: 'Internal server error' };

      throw new HttpException({
        message: errorResponse.message || 'Internal server error',
        error: errorResponse.error || 'Internal Server Error',
      }, status);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('/requests/approve/:id')
  /*
  * 보상 요청 승인 처리 (관리자용)
  */
  async approveRequest(@Req() req, @Param('id') id: string) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.patch(`http://event-svc:3200/requests/approve/${id}`, {}, {
          headers: { Authorization: req.headers.authorization },
        }),
      );
      return data;
    } catch (err) {
      const status = err.response?.status || 500;
      const errorResponse = err.response?.data || { message: 'Internal server error' };

      throw new HttpException({
        message: errorResponse.message || 'Internal server error',
        error: errorResponse.error || 'Internal Server Error',
      }, status);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('/requests/reject/:id')
  /*
  * 보상 요청 거부 처리 (관리자용)
  */
  async rejectRequest(@Req() req, @Param('id') id: string) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.patch(`http://event-svc:3200/requests/reject/${id}`, {}, {
          headers: { Authorization: req.headers.authorization },
        }),
      );
      return data;
    } catch (err) {
      const status = err.response?.status || 500;
      const errorResponse = err.response?.data || { message: 'Internal server error' };

      throw new HttpException({
        message: errorResponse.message || 'Internal server error',
        error: errorResponse.error || 'Internal Server Error',
      }, status);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  @Get('/requests/my')
  /*
  * 로그인한 유저의 보상 요청 내역 조회
  */
  async getMyRequests(@Req() req) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`http://event-svc:3200/requests/my`, {
          headers: { Authorization: req.headers.authorization },
        }),
      );
      return data;
    } catch (err) {
      const status = err.response?.status || 500;
      const errorResponse = err.response?.data || { message: 'Internal server error' };

      throw new HttpException({
        message: errorResponse.message || 'Internal server error',
        error: errorResponse.error || 'Internal Server Error',
      }, status);
    }
  }
}