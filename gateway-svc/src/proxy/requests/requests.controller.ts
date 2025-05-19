import {
    Controller, Post, Get, Patch, Param, Req, Query, UseGuards, HttpException
  } from '@nestjs/common';
  import { HttpService } from '@nestjs/axios';
  import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
  import { RolesGuard } from '../../auth/roles.guard';
  import { Roles } from '../../auth/roles.decorator';
  import { Role } from '../../common/roles.enum';
  import { firstValueFrom } from 'rxjs';
  
  const EVENT_SVC_URL = process.env.EVENT_SVC_URL;
  
  @Controller('api/requests')
  export class RequestsController {
    constructor(private readonly httpService: HttpService) {}
  
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.USER, Role.ADMIN)
    @Post(':eventId')
    async requestReward(@Req() req, @Param('eventId') eventId: string) {
      return await this.forwardRequest('post', `/${eventId}`, req);
    }
  
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.OPERATOR, Role.AUDITOR)
    @Get()
    async getRequests(@Req() req, @Query() query) {
      try {
        const { data } = await firstValueFrom(
          this.httpService.get(`${EVENT_SVC_URL}/requests`, {
            headers: { Authorization: req.headers.authorization },
            params: query,
          }),
        );
        return data;
      } catch (err) {
        const status = err.response?.status || 500;
        const errorResponse = err.response?.data || { message: 'Internal server error' };
        throw new HttpException({
          message: errorResponse.message,
          error: errorResponse.error,
        }, status);
      }
    }
  
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.OPERATOR)
    @Patch('/approve/:id')
    async approveRequest(@Req() req, @Param('id') id: string) {
      return await this.forwardRequest('patch', `/approve/${id}`, req);
    }
  
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.OPERATOR)
    @Patch('/reject/:id')
    async rejectRequest(@Req() req, @Param('id') id: string) {
      return await this.forwardRequest('patch', `/reject/${id}`, req);
    }
  
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.USER, Role.ADMIN)
    @Get('/my')
    async getMyRequests(@Req() req) {
      return await this.forwardRequest('get', '/my', req);
    }
  
    private async forwardRequest(method: string, path: string, req, body?: any) {
      try {
        const options = {
          headers: { Authorization: req.headers.authorization },
          ...(body && { data: body }),
        };
        const { data } = await firstValueFrom(
          this.httpService.request({ method, url: `${EVENT_SVC_URL}/requests${path}`, ...options })
        );
        return data;
      } catch (err) {
        const status = err.response?.status || 500;
        const errorResponse = err.response?.data || { message: 'Internal server error' };
        throw new HttpException({
          message: errorResponse.message,
          error: errorResponse.error,
        }, status);
      }
    }
  }