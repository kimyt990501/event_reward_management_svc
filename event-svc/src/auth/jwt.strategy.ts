import { Injectable, Inject} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });

    this.logger.log('[JwtStrategy] JWT strategy initialized', 'info');
  }

  async validate(payload: any) {
    this.logger.log(`[JwtStrategy] JWT validated. Payload: ${JSON.stringify(payload)}`, 'debug');

    return {
      userId: payload.sub,
      email: payload.email,
      roles: payload.roles,
    };
  }
}