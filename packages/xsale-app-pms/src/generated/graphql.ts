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
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  merchantAffiliates?: Maybe<Array<MerchantAffiliate>>;
  name?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  wechatOAuth?: Maybe<WechatOAuth>;
};

export type AffiliatePagination = {
  __typename?: 'AffiliatePagination';
  data: Array<Affiliate>;
  total: Scalars['Int']['output'];
};

export type AffiliateWhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type ApplyWechatMerchantInput = {
  bankCardPhoto: Scalars['String']['input'];
  businessLicensePhoto: Scalars['String']['input'];
  idCardPhoto: Scalars['String']['input'];
};

export type Article = {
  __typename?: 'Article';
  content?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  image?: Maybe<Scalars['String']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type AuthToken = {
  __typename?: 'AuthToken';
  expiresIn: Scalars['Float']['output'];
  merchant: Merchant;
  token: Scalars['String']['output'];
};

export type CreateAffiliateInput = {
  name: Scalars['String']['input'];
  phone: Scalars['String']['input'];
};

export type CreateProductInput = {
  commission: Scalars['Float']['input'];
  content: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  image: Scalars['String']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  poster?: InputMaybe<Scalars['String']['input']>;
  posterQrcodeConfig?: InputMaybe<PosterQrcodeConfigInput>;
  price: Scalars['Float']['input'];
  stock: Scalars['Int']['input'];
  title: Scalars['String']['input'];
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
  bankAccount?: Maybe<Scalars['String']['output']>;
  bankCardPhoto?: Maybe<Scalars['String']['output']>;
  bankName?: Maybe<Scalars['String']['output']>;
  businessLicensePhoto?: Maybe<Scalars['String']['output']>;
  businessScope?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  idCardPhoto?: Maybe<Scalars['String']['output']>;
  images?: Maybe<Array<Scalars['String']['output']>>;
  logo?: Maybe<Scalars['String']['output']>;
  merchantAffiliates?: Maybe<Array<MerchantAffiliate>>;
  name?: Maybe<Scalars['String']['output']>;
  orders?: Maybe<Array<Order>>;
  phone?: Maybe<Scalars['String']['output']>;
  products?: Maybe<Array<Product>>;
  updatedAt: Scalars['DateTime']['output'];
  wechatMerchantId?: Maybe<Scalars['String']['output']>;
  wechatMerchantNote?: Maybe<Scalars['String']['output']>;
  wechatMerchantSignUrl?: Maybe<Scalars['String']['output']>;
  wechatMerchantStatus?: Maybe<WechatMerchantStatus>;
  wechatQrcode?: Maybe<Scalars['String']['output']>;
};

export type MerchantAffiliate = {
  __typename?: 'MerchantAffiliate';
  affiliate: Affiliate;
  affiliateId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  merchant: Merchant;
  merchantId: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  applyWechatMerchant: Merchant;
  completeOrder: Order;
  createAffiliate: Affiliate;
  createProduct: Product;
  deleteAffiliate: Scalars['Boolean']['output'];
  deleteProduct: Scalars['Boolean']['output'];
  login: AuthToken;
  refundOrder: Order;
  register: AuthToken;
  sendSmsCode: Scalars['Boolean']['output'];
  updateMe: Merchant;
  updateProduct: Product;
};


export type MutationApplyWechatMerchantArgs = {
  data: ApplyWechatMerchantInput;
};


export type MutationCompleteOrderArgs = {
  id: Scalars['String']['input'];
};


export type MutationCreateAffiliateArgs = {
  data: CreateAffiliateInput;
};


export type MutationCreateProductArgs = {
  data: CreateProductInput;
};


export type MutationDeleteAffiliateArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteProductArgs = {
  id: Scalars['String']['input'];
};


export type MutationLoginArgs = {
  data: LoginInput;
};


export type MutationRefundOrderArgs = {
  id: Scalars['String']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
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


export type MutationUpdateProductArgs = {
  data: UpdateProductInput;
  id: Scalars['String']['input'];
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
  merchantAffiliateId?: Maybe<Scalars['String']['output']>;
  merchantAmount?: Maybe<Scalars['Float']['output']>;
  merchantId?: Maybe<Scalars['String']['output']>;
  note?: Maybe<Scalars['String']['output']>;
  paidAt?: Maybe<Scalars['DateTime']['output']>;
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
  wechatMerchantId?: Maybe<Scalars['String']['output']>;
  wechatTransactionId?: Maybe<Scalars['String']['output']>;
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
  commission?: Maybe<Scalars['Float']['output']>;
  content?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  image?: Maybe<Scalars['String']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  merchant?: Maybe<Merchant>;
  merchantId?: Maybe<Scalars['String']['output']>;
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
  id?: InputMaybe<Scalars['String']['input']>;
  merchantId?: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
  __typename?: 'Query';
  affiliate: Affiliate;
  affiliates: AffiliatePagination;
  me: Merchant;
  order: Order;
  orders: OrderPagination;
  product: Product;
  products: ProductPagination;
  signedFileUrl: SignedFileUrl;
};


export type QueryAffiliateArgs = {
  id: Scalars['String']['input'];
};


export type QueryAffiliatesArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<AffiliateWhereInput>;
};


export type QueryOrderArgs = {
  id: Scalars['String']['input'];
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

export type RegisterInput = {
  address: Scalars['String']['input'];
  affiliateId: Scalars['String']['input'];
  businessScope: Scalars['String']['input'];
  description: Scalars['String']['input'];
  images?: InputMaybe<Array<Scalars['String']['input']>>;
  logo: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  smsCode: Scalars['String']['input'];
  wechatQrcode: Scalars['String']['input'];
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
  address?: InputMaybe<Scalars['String']['input']>;
  businessScope?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  logo?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  wechatQrcode?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateProductInput = {
  commission?: InputMaybe<Scalars['Float']['input']>;
  content: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  image: Scalars['String']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  poster?: InputMaybe<Scalars['String']['input']>;
  posterQrcodeConfig?: InputMaybe<PosterQrcodeConfigInput>;
  price?: InputMaybe<Scalars['Float']['input']>;
  stock?: InputMaybe<Scalars['Int']['input']>;
  title: Scalars['String']['input'];
};

export enum WechatMerchantStatus {
  Applied = 'APPLIED',
  Completed = 'COMPLETED',
  Created = 'CREATED',
  Rejected = 'REJECTED'
}

export type WechatOAuth = {
  __typename?: 'WechatOAuth';
  accessToken: Scalars['String']['output'];
  affiliate: Affiliate;
  affiliateId: Scalars['String']['output'];
  avatar?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  expiresAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  nickName?: Maybe<Scalars['String']['output']>;
  openId: Scalars['String']['output'];
  refreshToken?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};
