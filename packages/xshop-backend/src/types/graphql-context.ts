import { Request } from 'express';
import { User } from '@/entities/user.entity';

export interface AdminContext {
  req: Request & {
    user?: User;
  };
  clientType?: string;
}

export interface StoreContext {
  req: Request & {
    user?: User;
  };
  clientType?: string;
}

export interface CreatorContext {
  req: Request & {
    user?: User;
  };
  clientType?: string;
}
