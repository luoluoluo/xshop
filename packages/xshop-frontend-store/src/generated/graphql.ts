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

export type ArticlePagination = {
  __typename?: 'ArticlePagination';
  data: Array<Article>;
  total: Scalars['Int']['output'];
};

export type AuthToken = {
  __typename?: 'AuthToken';
  expiresIn: Scalars['Float']['output'];
  token: Scalars['String']['output'];
  user: User;
};

export type CreateLinkInput = {
  friendId?: InputMaybe<Scalars['String']['input']>;
  logo?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  qrcode?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Scalars['Int']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type CreateOrderInput = {
  affiliateId?: InputMaybe<Scalars['String']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
  productId: Scalars['String']['input'];
  quantity: Scalars['Int']['input'];
  receiverName: Scalars['String']['input'];
  receiverPhone: Scalars['String']['input'];
};

export type CreateOrderPaymentInput = {
  openId: Scalars['String']['input'];
  orderId: Scalars['String']['input'];
};

export type CreateProductInput = {
  commission: Scalars['Float']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  images: Array<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  price: Scalars['Float']['input'];
  sort?: InputMaybe<Scalars['Int']['input']>;
  stock: Scalars['Int']['input'];
  title: Scalars['String']['input'];
};

export type CreateUserWechatMerchantInput = {
  bankAccountNumber: Scalars['String']['input'];
  businessLicensePhoto: Scalars['String']['input'];
  idCardBackPhoto: Scalars['String']['input'];
  idCardFrontPhoto: Scalars['String']['input'];
};

export type CreateWithdrawalInput = {
  amount: Scalars['Float']['input'];
  bankAccountName: Scalars['String']['input'];
  bankAccountNumber: Scalars['String']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
};

export type Link = {
  __typename?: 'Link';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  logo?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  qrcode?: Maybe<Scalars['String']['output']>;
  sort?: Maybe<Scalars['Int']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  url?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
  userId?: Maybe<Scalars['String']['output']>;
};

export type LinkPagination = {
  __typename?: 'LinkPagination';
  data: Array<Link>;
  total: Scalars['Int']['output'];
};

export type LinkWhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
};

export type LoginInput = {
  password?: InputMaybe<Scalars['String']['input']>;
  phone: Scalars['String']['input'];
  smsCode?: InputMaybe<Scalars['String']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createLink: Link;
  createOrder: Order;
  createOrderPayment: Payment;
  createProduct: Product;
  createUserWechatMerchant: User;
  createWithdrawal: Withdrawal;
  deleteLink: Scalars['Boolean']['output'];
  deleteProduct: Scalars['Boolean']['output'];
  login: AuthToken;
  refundOrder: Order;
  register: AuthToken;
  sendSmsCode: Scalars['Boolean']['output'];
  updateLink: Link;
  updateMe: User;
  updateMeWechatOAuth: User;
  updateProduct: Product;
  wechatLogin: AuthToken;
};


export type MutationCreateLinkArgs = {
  data: CreateLinkInput;
};


export type MutationCreateOrderArgs = {
  data: CreateOrderInput;
};


export type MutationCreateOrderPaymentArgs = {
  data: CreateOrderPaymentInput;
};


export type MutationCreateProductArgs = {
  data: CreateProductInput;
};


export type MutationCreateUserWechatMerchantArgs = {
  data: CreateUserWechatMerchantInput;
};


export type MutationCreateWithdrawalArgs = {
  data: CreateWithdrawalInput;
};


export type MutationDeleteLinkArgs = {
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


export type MutationUpdateLinkArgs = {
  data: UpdateLinkInput;
  id: Scalars['String']['input'];
};


export type MutationUpdateMeArgs = {
  data: UpdateMeInput;
};


export type MutationUpdateMeWechatOAuthArgs = {
  code: Scalars['String']['input'];
};


export type MutationUpdateProductArgs = {
  data: UpdateProductInput;
  id: Scalars['String']['input'];
};


export type MutationWechatLoginArgs = {
  data: WechatLoginInput;
};

export type Order = {
  __typename?: 'Order';
  affiliate?: Maybe<User>;
  affiliateAmount?: Maybe<Scalars['Float']['output']>;
  affiliateId?: Maybe<Scalars['String']['output']>;
  amount?: Maybe<Scalars['Float']['output']>;
  cancelledAt?: Maybe<Scalars['DateTime']['output']>;
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  customer?: Maybe<User>;
  id: Scalars['String']['output'];
  merchant?: Maybe<User>;
  merchantAmount?: Maybe<Scalars['Float']['output']>;
  merchantId?: Maybe<Scalars['String']['output']>;
  note?: Maybe<Scalars['String']['output']>;
  paidAt?: Maybe<Scalars['DateTime']['output']>;
  product?: Maybe<Array<Product>>;
  productDescription?: Maybe<Scalars['String']['output']>;
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
  merchantId?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<OrderStatus>;
};

export type Payment = {
  __typename?: 'Payment';
  appId: Scalars['String']['output'];
  nonceStr: Scalars['String']['output'];
  package: Scalars['String']['output'];
  paySign: Scalars['String']['output'];
  signType: Scalars['String']['output'];
  timeStamp: Scalars['String']['output'];
};

export type Product = {
  __typename?: 'Product';
  commission?: Maybe<Scalars['Float']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  images?: Maybe<Array<Scalars['String']['output']>>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  price?: Maybe<Scalars['Float']['output']>;
  sort?: Maybe<Scalars['Int']['output']>;
  stock?: Maybe<Scalars['Int']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  user?: Maybe<User>;
  userId?: Maybe<Scalars['String']['output']>;
};

export type ProductPagination = {
  __typename?: 'ProductPagination';
  data: Array<Product>;
  total: Scalars['Int']['output'];
};

export type ProductWhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
  __typename?: 'Query';
  affiliateOrder: Order;
  article: Article;
  articles: ArticlePagination;
  customerOrder: Order;
  link: Link;
  links: LinkPagination;
  me: User;
  order: Order;
  orderStatus: OrderStatus;
  orders: OrderPagination;
  product: Product;
  products: ProductPagination;
  shortLink: ShortLink;
  signedFileUrl: SignedFileUrl;
  user: User;
  wechatAccessToken: WechatAccessToken;
  wechatJsConfig?: Maybe<WechatJsConfig>;
  wechatOauthUrl: Scalars['String']['output'];
  wechatVerifySignature: Scalars['Boolean']['output'];
  withdrawal: Withdrawal;
  withdrawals: WithdrawalPagination;
};


export type QueryAffiliateOrderArgs = {
  id: Scalars['String']['input'];
};


export type QueryArticleArgs = {
  slug: Scalars['String']['input'];
};


export type QueryArticlesArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryCustomerOrderArgs = {
  id: Scalars['String']['input'];
};


export type QueryLinkArgs = {
  id: Scalars['String']['input'];
};


export type QueryLinksArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  sorters: Array<SorterInput>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: LinkWhereInput;
};


export type QueryOrderArgs = {
  id: Scalars['String']['input'];
};


export type QueryOrderStatusArgs = {
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
  sorters?: InputMaybe<Array<SorterInput>>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ProductWhereInput>;
};


export type QueryShortLinkArgs = {
  id: Scalars['String']['input'];
};


export type QuerySignedFileUrlArgs = {
  filename: Scalars['String']['input'];
};


export type QueryUserArgs = {
  id: Scalars['String']['input'];
};


export type QueryWechatAccessTokenArgs = {
  code: Scalars['String']['input'];
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


export type QueryWithdrawalArgs = {
  id: Scalars['String']['input'];
};


export type QueryWithdrawalsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<WithdrawalWhereInput>;
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

export type ShortLink = {
  __typename?: 'ShortLink';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  url: Scalars['String']['output'];
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

export enum SorterDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type SorterInput = {
  direction: SorterDirection;
  field: Scalars['String']['input'];
};

export type UpdateLinkInput = {
  logo?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  qrcode?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Scalars['Int']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateMeInput = {
  avatar?: InputMaybe<Scalars['String']['input']>;
  backgroundImage?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  wechatId?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateProductInput = {
  commission?: InputMaybe<Scalars['Float']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  images?: InputMaybe<Array<Scalars['String']['input']>>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
  sort?: InputMaybe<Scalars['Int']['input']>;
  stock?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  avatar?: Maybe<Scalars['String']['output']>;
  backgroundImage?: Maybe<Scalars['String']['output']>;
  balance?: Maybe<Scalars['Float']['output']>;
  bankAccountName?: Maybe<Scalars['String']['output']>;
  bankAccountNumber?: Maybe<Scalars['String']['output']>;
  businessLicensePhoto?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  idCardBackPhoto?: Maybe<Scalars['String']['output']>;
  idCardFrontPhoto?: Maybe<Scalars['String']['output']>;
  links?: Maybe<Array<Link>>;
  name?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  products?: Maybe<Array<Product>>;
  slug?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  wechatId?: Maybe<Scalars['String']['output']>;
  wechatMerchantId?: Maybe<Scalars['String']['output']>;
  wechatMerchantStatus?: Maybe<WechatMerchantStatus>;
  wechatOpenId?: Maybe<Scalars['String']['output']>;
};

export type WechatAccessToken = {
  __typename?: 'WechatAccessToken';
  accessToken: Scalars['String']['output'];
  expiresIn: Scalars['Float']['output'];
  openId: Scalars['String']['output'];
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

export type WechatLoginInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
};

export enum WechatMerchantStatus {
  Completed = 'COMPLETED',
  Created = 'CREATED'
}

export type Withdrawal = {
  __typename?: 'Withdrawal';
  afterTaxAmount?: Maybe<Scalars['Float']['output']>;
  amount?: Maybe<Scalars['Float']['output']>;
  approvedAt?: Maybe<Scalars['DateTime']['output']>;
  bankAccountName?: Maybe<Scalars['String']['output']>;
  bankAccountNumber?: Maybe<Scalars['String']['output']>;
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  note?: Maybe<Scalars['String']['output']>;
  rejectedAt?: Maybe<Scalars['DateTime']['output']>;
  status?: Maybe<WithdrawalStatus>;
  taxAmount?: Maybe<Scalars['Float']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  user?: Maybe<User>;
  userId?: Maybe<Scalars['String']['output']>;
};

export type WithdrawalPagination = {
  __typename?: 'WithdrawalPagination';
  data: Array<Withdrawal>;
  total: Scalars['Int']['output'];
};

export enum WithdrawalStatus {
  Completed = 'COMPLETED',
  Created = 'CREATED'
}

export type WithdrawalWhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<WithdrawalStatus>;
};
