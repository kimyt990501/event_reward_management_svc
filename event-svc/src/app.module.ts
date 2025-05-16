import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { WinstonModule } from 'nest-winston';
import { winstonLoggerConfig } from './logger/logger.config';
import { Event, EventSchema } from './events/event.schema';
import { Reward, RewardSchema } from './rewards/reward.schema';
import { Request, RequestSchema } from './requests/request.schema';
import { User, UserSchema } from './users/user.schema';
import { EventsService } from './events/events.service';
import { RewardsService } from './rewards/rewards.service';
import { RequestsService } from './requests/requests.service';
import { EventsController } from './events/events.controller';
import { RewardsController } from './rewards/rewards.controller';
import { RequestsController } from './requests/requests.controller';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: true, }),
    WinstonModule.forRoot(winstonLoggerConfig),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
      }),
    }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN') },
      }),
    }),

    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: Reward.name, schema: RewardSchema },
      { name: Request.name, schema: RequestSchema },
      { name: User.name, schema: UserSchema },
    ]),

    PassportModule,

    HttpModule,
  ],
  controllers: [
    EventsController,
    RewardsController,
    RequestsController,
  ],
  providers: [
    EventsService,
    RewardsService,
    RequestsService,
    JwtStrategy,
  ],
})
export class AppModule {}