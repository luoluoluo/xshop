export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type Affiliate = {
  __typename?: 'Affiliate';
  accountName?: Maybe<Scalars['String']['output']>;
  balance?: Maybe<Scalars['Float']['output']>;
  bankAccount?: Maybe<Scalars['String']['output']>;
  bankName?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type AffiliateWithdrawal = {
  __typename?: 'AffiliateWithdrawal';
  accountName?: Maybe<Scalars['String']['output']>;
  affiliate?: Maybe<Affiliate>;
  affiliateId?: Maybe<Scalars['String']['output']>;
  amount?: Maybe<Scalars['Float']['output']>;
  approvedAt?: Maybe<Scalars['DateTime']['output']>;
  bankAccount?: Maybe<Scalars['String']['output']>;
  bankName?: Maybe<Scalars['String']['output']>;
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  note?: Maybe<Scalars['String']['output']>;
  rejectReason?: Maybe<Scalars['String']['output']>;
  rejectedAt?: Maybe<Scalars['DateTime']['output']>;
  status?: Maybe<AffiliateWithdrawalStatus>;
  updatedAt: Scalars['DateTime']['output'];
};

export type AffiliateWithdrawalPagination = {
  __typename?: 'AffiliateWithdrawalPagination';
  data: Array<AffiliateWithdrawal>;
  total: Scalars['Int']['output'];
};

export enum AffiliateWithdrawalStatus {
  Approved = 'APPROVED',
  Completed = 'COMPLETED',
  Created = 'CREATED',
  Rejected = 'REJECTED'
}

export type AffiliateWithdrawalWhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<AffiliateWithdrawalStatus>;
};

export type Article = {
  __typename?: 'Article';
  content?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  image?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type AuthToken = {
  __typename?: 'AuthToken';
  affiliate: Affiliate;
  expiresIn: Scalars['Float']['output'];
  token: Scalars['String']['output'];
};

export type CreateAffiliateWithdrawalInput = {
  accountName: Scalars['String']['input'];
  amount: Scalars['Float']['input'];
  bankAccount: Scalars['String']['input'];
  bankName: Scalars['String']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
};

export type Customer = {
  __typename?: 'Customer';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type LoginInput = {
  password?: InputMaybe<Scalars['String']['input']>;
  phone: Scalars['String']['input'];
  smsCode?: InputMaybe<Scalars['String']['input']>;
};

export type Merchant = {
  __typename?: 'Merchant';
  accountName?: Maybe<Scalars['String']['output']>;
  address?: Maybe<Scalars['String']['output']>;
  affiliate?: Maybe<Affiliate>;
  affiliateId?: Maybe<Scalars['String']['output']>;
  bankAccount?: Maybe<Scalars['String']['output']>;
  bankName?: Maybe<Scalars['String']['output']>;
  businessScope?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  logo?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  orders?: Maybe<Array<Order>>;
  phone?: Maybe<Scalars['String']['output']>;
  products?: Maybe<Array<Product>>;
  updatedAt: Scalars['DateTime']['output'];
  wechatQrcode?: Maybe<Scalars['String']['output']>;
};

export type MerchantPagination = {
  __typename?: 'MerchantPagination';
  data: Array<Merchant>;
  total: Scalars['Int']['output'];
};

export type MerchantWhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type MerchantWithdrawal = {
  __typename?: 'MerchantWithdrawal';
  accountName?: Maybe<Scalars['String']['output']>;
  amount?: Maybe<Scalars['Float']['output']>;
  approvedAt?: Maybe<Scalars['DateTime']['output']>;
  bankAccount?: Maybe<Scalars['String']['output']>;
  bankName?: Maybe<Scalars['String']['output']>;
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  merchant?: Maybe<Merchant>;
  merchantId?: Maybe<Scalars['String']['output']>;
  note?: Maybe<Scalars['String']['output']>;
  rejectReason?: Maybe<Scalars['String']['output']>;
  rejectedAt?: Maybe<Scalars['DateTime']['output']>;
  status?: Maybe<MerchantWithdrawalStatus>;
  updatedAt: Scalars['DateTime']['output'];
};

export enum MerchantWithdrawalStatus {
  Approved = 'APPROVED',
  Completed = 'COMPLETED',
  Created = 'CREATED',
  Rejected = 'REJECTED'
}

export type Mutation = {
  __typename?: 'Mutation';
  createAffiliateWithdrawal: AffiliateWithdrawal;
  login: AuthToken;
  register: AuthToken;
  sendSmsCode: Scalars['Boolean']['output'];
  updateMe: Affiliate;
};


export type MutationCreateAffiliateWithdrawalArgs = {
  data: CreateAffiliateWithdrawalInput;
};


export type MutationLoginArgs = {
  data: LoginInput;
};


export type MutationRegisterArgs = {
  data: RegisterInput;
};


export type MutationSendSmsCodeArgs = {
  data: SendSmsCodeInput;
};


export type MutationUpdateMeArgs = {
  data: UpdateMeInput;
};

export type Order = {
  __typename?: 'Order';
  affiliate?: Maybe<Affiliate>;
  affiliateAmount?: Maybe<Scalars['Float']['output']>;
  affiliateId?: Maybe<Scalars['String']['output']>;
  amount?: Maybe<Scalars['Float']['output']>;
  cancelledAt?: Maybe<Scalars['DateTime']['output']>;
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  customer?: Maybe<Customer>;
  id: Scalars['String']['output'];
  merchant?: Maybe<Merchant>;
  merchantAffiliate?: Maybe<Affiliate>;
  merchantAffiliateAmount?: Maybe<Scalars['Float']['output']>;
  merchantAffiliateId?: Maybe<Scalars['String']['output']>;
  merchantAmount?: Maybe<Scalars['Float']['output']>;
  merchantId?: Maybe<Scalars['String']['output']>;
  note?: Maybe<Scalars['String']['output']>;
  paidAt?: Maybe<Scalars['DateTime']['output']>;
  platformAmount?: Maybe<Scalars['Float']['output']>;
  product?: Maybe<Array<Product>>;
  productContent?: Maybe<Scalars['String']['output']>;
  productId?: Maybe<Scalars['String']['output']>;
  productImage?: Maybe<Scalars['String']['output']>;
  productPrice?: Maybe<Scalars['Float']['output']>;
  productTitle?: Maybe<Scalars['String']['output']>;
  quantity?: Maybe<Scalars['Int']['output']>;
  receiverName?: Maybe<Scalars['String']['output']>;
  receiverPhone?: Maybe<Scalars['String']['output']>;
  refundedAt?: Maybe<Scalars['DateTime']['output']>;
  status?: Maybe<OrderStatus>;
  updatedAt: Scalars['DateTime']['output'];
};

export type OrderPagination = {
  __typename?: 'OrderPagination';
  data: Array<Order>;
  total: Scalars['Int']['output'];
};

export enum OrderStatus {
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Created = 'CREATED',
  Paid = 'PAID',
  Refunded = 'REFUNDED'
}

export type OrderWhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  isMerchantAffiliate?: InputMaybe<Scalars['Boolean']['input']>;
  merchantId?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<OrderStatus>;
};

export type PosterQrcodeConfig = {
  __typename?: 'PosterQrcodeConfig';
  h?: Maybe<Scalars['Float']['output']>;
  w?: Maybe<Scalars['Float']['output']>;
  x?: Maybe<Scalars['Float']['output']>;
  y?: Maybe<Scalars['Float']['output']>;
};

export type PosterQrcodeConfigInput = {
  h?: InputMaybe<Scalars['Float']['input']>;
  w?: InputMaybe<Scalars['Float']['input']>;
  x?: InputMaybe<Scalars['Float']['input']>;
  y?: InputMaybe<Scalars['Float']['input']>;
};

export type Product = {
  __typename?: 'Product';
  affiliateCommission?: Maybe<Scalars['Float']['output']>;
  commission?: Maybe<Scalars['Float']['output']>;
  content?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  image?: Maybe<Scalars['String']['output']>;
  merchant?: Maybe<Merchant>;
  merchantAffiliateCommission?: Maybe<Scalars['Float']['output']>;
  merchantId?: Maybe<Scalars['String']['output']>;
  platformCommission?: Maybe<Scalars['Float']['output']>;
  poster?: Maybe<Scalars['String']['output']>;
  posterQrcodeConfig?: Maybe<PosterQrcodeConfig>;
  price?: Maybe<Scalars['Float']['output']>;
  stock?: Maybe<Scalars['Int']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type ProductPagination = {
  __typename?: 'ProductPagination';
  data: Array<Product>;
  total: Scalars['Int']['output'];
};

export type ProductWhereInput = {
  categoryId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  merchantId?: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
  __typename?: 'Query';
  affiliateWithdrawal: AffiliateWithdrawal;
  affiliateWithdrawals: AffiliateWithdrawalPagination;
  me: Affiliate;
  merchant: Merchant;
  merchants: MerchantPagination;
  order: Order;
  orders: OrderPagination;
  product: Product;
  products: ProductPagination;
  signedFileUrl: SignedFileUrl;
  wechatJsConfig?: Maybe<WechatJsConfig>;
  wechatOauthUrl: Scalars['String']['output'];
  wechatVerifySignature: Scalars['Boolean']['output'];
};


export type QueryAffiliateWithdrawalArgs = {
  id: Scalars['String']['input'];
};


export type QueryAffiliateWithdrawalsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<AffiliateWithdrawalWhereInput>;
};


export type QueryMerchantArgs = {
  affiliateId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
};


export type QueryMerchantsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<MerchantWhereInput>;
};


export type QueryOrderArgs = {
  id: Scalars['String']['input'];
  isMerchantAffiliate?: Scalars['Boolean']['input'];
};


export type QueryOrdersArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: OrderWhereInput;
};


export type QueryProductArgs = {
  id: Scalars['String']['input'];
};


export type QueryProductsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: ProductWhereInput;
};


export type QuerySignedFileUrlArgs = {
  filename: Scalars['String']['input'];
};


export type QueryWechatJsConfigArgs = {
  where: WechatJsConfigWhere;
};


export type QueryWechatOauthUrlArgs = {
  redirectUrl: Scalars['String']['input'];
  scope?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
};


export type QueryWechatVerifySignatureArgs = {
  nonce: Scalars['String']['input'];
  signature: Scalars['String']['input'];
  timestamp: Scalars['String']['input'];
  token: Scalars['String']['input'];
};

export type RegisterInput = {
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  smsCode: Scalars['String']['input'];
};

export type SendSmsCodeInput = {
  phone: Scalars['String']['input'];
  type: SmsCodeType;
};

export type SignedFileUrl = {
  __typename?: 'SignedFileUrl';
  downloadUrl: Scalars['String']['output'];
  uploadUrl: Scalars['String']['output'];
};

/** 短信验证码类型 */
export enum SmsCodeType {
  Login = 'LOGIN',
  Register = 'REGISTER'
}

export type UpdateMeInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
};

export type WechatJsConfig = {
  __typename?: 'WechatJsConfig';
  appId: Scalars['String']['output'];
  nonceStr: Scalars['String']['output'];
  signature: Scalars['String']['output'];
  timestamp: Scalars['Float']['output'];
};

export type WechatJsConfigWhere = {
  url?: InputMaybe<Scalars['String']['input']>;
};
