import { Module } from '@nestjs/common';
import { AuthModule } from './auth-proxy/auth.module';
import { EventsModule } from './events-proxy/events.module';
import { RewardsModule } from './rewards-proxy/rewards.module';
import { RequestsModule } from './requests-proxy/requests.module';

@Module({
  imports: [
    AuthModule,
    EventsModule,
    RewardsModule,
    RequestsModule,
  ],
  exports: [
    AuthModule,
    EventsModule,
    RewardsModule,
    RequestsModule,
  ],
})
export class ProxyModule {}