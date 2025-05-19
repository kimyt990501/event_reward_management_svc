import {
    Controller, Post, Get, Delete, Param, Req, UseGuards, HttpException, Body
  } from '@nestjs/common';
  import { HttpService } from '@nestjs/axios';
  import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
  import { RolesGuard } from '../../auth/roles.guard';
  import { Roles } from '../../auth/roles.decorator';
  import { Role } from '../../common/roles.enum';
  import { firstValueFrom } from 'rxjs';
  
  const EVENT_SVC_URL = process.env.EVENT_SVC_URL;
  
  @Controller('api/rewards')
  export class RewardsController {
    constructor(private readonly httpService: HttpService) {}
  
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.OPERATOR)
    @Post()
    async createReward(@Req() req, @Body() body) {
      return await this.forwardRequest('post', '', req, body);
    }
  
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.OPERATOR)
    @Get()
    async getAllRewards(@Req() req) {
      return await this.forwardRequest('get', '', req);
    }
  
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.OPERATOR)
    @Delete(':rewardId')
    async deleteReward(@Req() req, @Param('rewardId') rewardId: string) {
      return await this.forwardRequest('delete', `/${rewardId}`, req);
    }
  
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.OPERATOR)
    @Get('/event/:eventId')
    async getRewardsByEvent(@Req() req, @Param('eventId') eventId: string) {
      return await this.forwardRequest('get', `/event/${eventId}`, req);
    }
  
    private async forwardRequest(method: string, path: string, req, body?: any) {
      try {
        const options = {
          headers: { Authorization: req.headers.authorization },
          ...(body && { data: body }),
        };
        const { data } = await firstValueFrom(
          this.httpService.request({ method, url: `${EVENT_SVC_URL}/rewards${path}`, ...options })
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