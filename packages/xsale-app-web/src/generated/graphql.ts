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
  balance: Scalars['Float']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type AffiliateWithdrawal = {
  __typename?: 'AffiliateWithdrawal';
  accountName: Scalars['String']['output'];
  affiliate: Affiliate;
  affiliateId: Scalars['String']['output'];
  amount: Scalars['Float']['output'];
  approvedAt?: Maybe<Scalars['DateTime']['output']>;
  bankAccount: Scalars['String']['output'];
  bankName: Scalars['String']['output'];
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  note?: Maybe<Scalars['String']['output']>;
  rejectReason?: Maybe<Scalars['String']['output']>;
  rejectedAt?: Maybe<Scalars['DateTime']['output']>;
  status: AffiliateWithdrawalStatus;
  updatedAt: Scalars['DateTime']['output'];
};

export enum AffiliateWithdrawalStatus {
  Approved = 'APPROVED',
  Completed = 'COMPLETED',
  Created = 'CREATED',
  Rejected = 'REJECTED'
}

export type Article = {
  __typename?: 'Article';
  category?: Maybe<ArticleCategory>;
  categoryId?: Maybe<Scalars['String']['output']>;
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['String']['output'];
  image: Scalars['String']['output'];
  sort: Scalars['Float']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type ArticleCategory = {
  __typename?: 'ArticleCategory';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  parent?: Maybe<ArticleCategory>;
  parentId?: Maybe<Scalars['String']['output']>;
  sort: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type ArticleCategoryPagination = {
  __typename?: 'ArticleCategoryPagination';
  data: Array<ArticleCategory>;
  total: Scalars['Int']['output'];
};

export type ArticleCategoryWhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  parentId?: InputMaybe<Scalars['String']['input']>;
};

export type ArticlePagination = {
  __typename?: 'ArticlePagination';
  data: Array<Article>;
  total: Scalars['Int']['output'];
};

export type AuthToken = {
  __typename?: 'AuthToken';
  customer: Customer;
  expiresIn: Scalars['Float']['output'];
  token: Scalars['String']['output'];
};

export type Banner = {
  __typename?: 'Banner';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  image: Scalars['String']['output'];
  link?: Maybe<Scalars['String']['output']>;
  merchant?: Maybe<Merchant>;
  merchantId?: Maybe<Scalars['String']['output']>;
  sort: Scalars['Float']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type BannerPagination = {
  __typename?: 'BannerPagination';
  data: Array<Banner>;
  total: Scalars['Int']['output'];
};

export type BannerWhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  merchantId?: InputMaybe<Scalars['String']['input']>;
};

export type CreateOrderInput = {
  affiliateId?: InputMaybe<Scalars['String']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
  productId: Scalars['String']['input'];
  quantity: Scalars['Int']['input'];
  receiverName: Scalars['String']['input'];
  receiverPhone: Scalars['String']['input'];
};

export type CreatePaymentInput = {
  openId: Scalars['String']['input'];
  orderId: Scalars['String']['input'];
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
  name?: InputMaybe<Scalars['String']['input']>;
  phone: Scalars['String']['input'];
};

export type Merchant = {
  __typename?: 'Merchant';
  address: Scalars['String']['output'];
  affiliate?: Maybe<Affiliate>;
  affiliateId?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['String']['output'];
  logo: Scalars['String']['output'];
  name: Scalars['String']['output'];
  orders?: Maybe<Array<Order>>;
  phone: Scalars['String']['output'];
  products?: Maybe<Array<Product>>;
  updatedAt: Scalars['DateTime']['output'];
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
  accountName: Scalars['String']['output'];
  amount: Scalars['Float']['output'];
  approvedAt?: Maybe<Scalars['DateTime']['output']>;
  bankAccount: Scalars['String']['output'];
  bankName: Scalars['String']['output'];
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  merchant: Merchant;
  merchantId: Scalars['String']['output'];
  note?: Maybe<Scalars['String']['output']>;
  rejectReason?: Maybe<Scalars['String']['output']>;
  rejectedAt?: Maybe<Scalars['DateTime']['output']>;
  status: MerchantWithdrawalStatus;
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
  cancelOrder: Order;
  createOrder: Order;
  createOrderPayment: Payment;
  login: AuthToken;
  refundOrder: Order;
  updateMe: Customer;
};


export type MutationCancelOrderArgs = {
  id: Scalars['String']['input'];
};


export type MutationCreateOrderArgs = {
  data: CreateOrderInput;
};


export type MutationCreateOrderPaymentArgs = {
  data: CreatePaymentInput;
};


export type MutationLoginArgs = {
  data: LoginInput;
};


export type MutationRefundOrderArgs = {
  data: RefundOrderInput;
};


export type MutationUpdateMeArgs = {
  data: UpdateMeInput;
};

export type Order = {
  __typename?: 'Order';
  affiliate?: Maybe<Affiliate>;
  affiliateAmount?: Maybe<Scalars['Float']['output']>;
  affiliateId?: Maybe<Scalars['String']['output']>;
  amount: Scalars['Float']['output'];
  cancelledAt?: Maybe<Scalars['DateTime']['output']>;
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  customer: Customer;
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
  product: Array<Product>;
  productContent?: Maybe<Scalars['String']['output']>;
  productId: Scalars['String']['output'];
  productImage?: Maybe<Scalars['String']['output']>;
  productPrice: Scalars['Float']['output'];
  productTitle?: Maybe<Scalars['String']['output']>;
  quantity: Scalars['Int']['output'];
  receiverName?: Maybe<Scalars['String']['output']>;
  receiverPhone?: Maybe<Scalars['String']['output']>;
  refundedAt?: Maybe<Scalars['DateTime']['output']>;
  status: OrderStatus;
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
  merchantId?: InputMaybe<Scalars['String']['input']>;
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
  attributes?: Maybe<Array<ProductAttribute>>;
  category?: Maybe<ProductCategory>;
  categoryId?: Maybe<Scalars['String']['output']>;
  commission: Scalars['Float']['output'];
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  image: Scalars['String']['output'];
  merchant?: Maybe<Merchant>;
  merchantId?: Maybe<Scalars['String']['output']>;
  price: Scalars['Float']['output'];
  sort: Scalars['Int']['output'];
  stock: Scalars['Int']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type ProductAttribute = {
  __typename?: 'ProductAttribute';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  product: Product;
  updatedAt: Scalars['DateTime']['output'];
  values: Array<Scalars['String']['output']>;
};

export type ProductCategory = {
  __typename?: 'ProductCategory';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  image?: Maybe<Scalars['String']['output']>;
  merchant?: Maybe<Merchant>;
  merchantId?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  sort: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type ProductCategoryPagination = {
  __typename?: 'ProductCategoryPagination';
  data: Array<ProductCategory>;
  total: Scalars['Int']['output'];
};

export type ProductCategoryWhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  merchantId?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
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
  title?: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
  __typename?: 'Query';
  affiliateOrder: Order;
  affiliateOrders: OrderPagination;
  article: Article;
  articleCategories: ArticleCategoryPagination;
  articleCategory: ArticleCategory;
  articles: ArticlePagination;
  banners: BannerPagination;
  merchant: Merchant;
  merchants: MerchantPagination;
  order: Order;
  orderStatus: OrderStatus;
  orders: OrderPagination;
  product: Product;
  productCategories: ProductCategoryPagination;
  productCategory: ProductCategory;
  products: ProductPagination;
  wechatAccessToken: WechatAccessToken;
  wechatJsConfig?: Maybe<WechatJsConfig>;
  wechatOauthUrl: Scalars['String']['output'];
  wechatVerifySignature: Scalars['Boolean']['output'];
};


export type QueryAffiliateOrderArgs = {
  id: Scalars['String']['input'];
};


export type QueryAffiliateOrdersArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: OrderWhereInput;
};


export type QueryArticleArgs = {
  id: Scalars['String']['input'];
};


export type QueryArticleCategoriesArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: ArticleCategoryWhereInput;
};


export type QueryArticleCategoryArgs = {
  id: Scalars['String']['input'];
};


export type QueryArticlesArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryBannersArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<BannerWhereInput>;
};


export type QueryMerchantArgs = {
  affiliateId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
};


export type QueryMerchantsArgs = {
  affiliateId?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<MerchantWhereInput>;
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


export type QueryProductCategoriesArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: ProductCategoryWhereInput;
};


export type QueryProductCategoryArgs = {
  id: Scalars['String']['input'];
};


export type QueryProductsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: ProductWhereInput;
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

export type RefundOrderInput = {
  orderId: Scalars['String']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateMeInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
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
