import { Request } from 'express';
import { User } from '@/entities/user.entity';
import { Merchant } from '@/entities/merchant.entity';
import { Customer } from '@/entities/customer.entity';
import { Affiliate } from '@/entities/affiliate.entity';

export interface CmsContext {
  req: Request & {
    user?: User;
  };
  clientType?: string;
}

export interface WebContext {
  req: Request & {
    user?: Customer;
  };
  clientType?: string;
}

export interface CrmContext {
  req: Request & {
    user?: Affiliate;
  };
  clientType?: string;
}

export interface PmsContext {
  req: Request & {
    user?: Merchant;
  };
  clientType?: string;
}
