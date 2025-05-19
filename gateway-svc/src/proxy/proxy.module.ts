import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from './auth/auth.controller';
import { EventsController } from './events/events.controller';
import { RewardsController } from './rewards/rewards.controller';
import { RequestsController } from './requests/requests.controller';

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