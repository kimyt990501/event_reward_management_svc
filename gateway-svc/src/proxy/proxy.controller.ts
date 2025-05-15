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
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../common/roles.enum';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Controller()
export class ProxyController {
  constructor(private readonly httpService: HttpService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  @Post('/events')
  async createEvent(@Req() req, @Body() body, @Res() res) {
    const { data } = await firstValueFrom(
      this.httpService.post('http://event-svc:3200/events', body, {
        headers: { Authorization: req.headers.authorization },
      }),
    );
    return res.send(data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  @Post('/requests/:eventId')
  async requestReward(@Req() req, @Param('eventId') id: string, @Res() res) {
    const { data } = await firstValueFrom(
      this.httpService.post(`http://event-svc:3200/requests/${id}`, {}, {
        headers: { Authorization: req.headers.authorization },
      }),
    );
    return res.send(data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN, Role.AUDITOR, Role.OPERATOR)
  @Get('/requests')
  async getRequests(@Req() req, @Res() res) {
    const { data } = await firstValueFrom(
      this.httpService.get('http://event-svc:3200/requests', {
        headers: { Authorization: req.headers.authorization },
      }),
    );
    return res.send(data);
  }
}