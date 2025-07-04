import { Role } from '../../common/roles.enum';

export class CreateUserDto {
  email: string;
  password: string;
  roles?: Role[];
  invitedBy?: string;
}