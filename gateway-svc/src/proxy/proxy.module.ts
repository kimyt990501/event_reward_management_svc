import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from './auth-proxy/auth.controller';
import { EventsController } from './events-proxy/events.controller';
import { RewardsController } from './rewards-proxy/rewards.controller';
import { RequestsController } from './requests-proxy/requests.controller';

@Module({
  imports: [HttpModule],
  controllers: [
    AuthController,
    EventsController,
    RewardsController,
    RequestsController,
  ],
})
export class ProxyModule {}