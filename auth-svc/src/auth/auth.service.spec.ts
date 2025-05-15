import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    findByEmail: jest.fn(),
    findById: jest.fn(),  // 이 부분 추가
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('validateUser', () => {
    it('should return user data without password if valid credentials', async () => {
      /**
       * 유효한 이메일과 비밀번호가 주어졌을 때
       * - 사용자 정보를 반환하되 password 필드는 제외되는지 확인
       * - lastLoginAt 필드를 업데이트 하기 위해 save() 호출되는지 검증
       */
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

      const user = {
        _id: 'user1',
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
        roles: ['USER'],
        lastLoginAt: yesterday,
        toObject: function () { return { ...this }; },
        save: jest.fn().mockResolvedValue(true),
      };

      mockUsersService.findByEmail.mockResolvedValue(user);
      mockUsersService.findById.mockResolvedValue(user);

      const result = await service.validateUser('test@example.com', 'password123');
      expect(result).toHaveProperty('_id', 'user1');
      expect(result).toHaveProperty('email', 'test@example.com');
      expect(result).not.toHaveProperty('password');
      expect(user.save).toHaveBeenCalled();
    });

    it('should return null if user not found', async () => {
      /**
       * 이메일에 해당하는 유저가 없을 경우 null 반환 테스트
       */
      mockUsersService.findByEmail.mockResolvedValue(null);

      const result = await service.validateUser('nonexistent@example.com', 'password123');
      expect(result).toBeNull();
    });

    it('should return null if password does not match', async () => {
      /**
       * 비밀번호가 일치하지 않을 경우 null 반환 테스트
       */
      const user = {
        _id: 'user1',
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
        toObject: function () { return { ...this }; },
      };

      mockUsersService.findByEmail.mockResolvedValue(user);

      const result = await service.validateUser('test@example.com', 'wrongpassword');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token', async () => {
      /**
       * 로그인 시 JWT 토큰이 제대로 발급되는지 테스트
       */
      const user = { _id: 'user1', email: 'test@example.com', roles: ['USER'] };
      mockJwtService.sign.mockReturnValue('signed_jwt_token');

      const result = await service.login(user);
      expect(result).toEqual({ access_token: 'signed_jwt_token' });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: user.email,
        sub: user._id,
        roles: user.roles,
      });
    });
  });
});