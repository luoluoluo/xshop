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
  isActive?: Maybe<Scalars['Boolean']['output']>;
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

export type CompleteUserWechatMerchantInput = {
  wechatMerchantId: Scalars['String']['input'];
};

export type CreateArticleInput = {
  content: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  slug: Scalars['String']['input'];
  title: Scalars['String']['input'];
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

export type CreateRoleInput = {
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  permissions?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type CreateUserInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  roleIds?: InputMaybe<Array<Scalars['String']['input']>>;
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

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  completeUserWechatMerchant: Scalars['Boolean']['output'];
  completeWithdrawal: Withdrawal;
  createArticle: Article;
  createProduct: Product;
  createRole: Role;
  createUser: User;
  deleteArticle: Scalars['Boolean']['output'];
  deleteProduct: Scalars['Boolean']['output'];
  deleteRole: Scalars['Boolean']['output'];
  deleteUser: Scalars['Boolean']['output'];
  login: AuthToken;
  updateArticle: Article;
  updateProduct: Product;
  updateRole: Role;
  updateUser: User;
};


export type MutationCompleteUserWechatMerchantArgs = {
  data: CompleteUserWechatMerchantInput;
};


export type MutationCompleteWithdrawalArgs = {
  id: Scalars['String']['input'];
};


export type MutationCreateArticleArgs = {
  data: CreateArticleInput;
};


export type MutationCreateProductArgs = {
  data: CreateProductInput;
};


export type MutationCreateRoleArgs = {
  data: CreateRoleInput;
};


export type MutationCreateUserArgs = {
  data: CreateUserInput;
};


export type MutationDeleteArticleArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteProductArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteRoleArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['String']['input'];
};


export type MutationLoginArgs = {
  data: LoginInput;
};


export type MutationUpdateArticleArgs = {
  data: UpdateArticleInput;
  id: Scalars['String']['input'];
};


export type MutationUpdateProductArgs = {
  data: UpdateProductInput;
  id: Scalars['String']['input'];
};


export type MutationUpdateRoleArgs = {
  data: UpdateRoleInput;
  id: Scalars['String']['input'];
};


export type MutationUpdateUserArgs = {
  data: UpdateUserInput;
  id: Scalars['String']['input'];
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
  affiliateId?: InputMaybe<Scalars['String']['input']>;
  customerId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  merchantId?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<OrderStatus>;
};

export type Permission = {
  __typename?: 'Permission';
  action: Scalars['String']['output'];
  resource: Scalars['String']['output'];
  value: Scalars['String']['output'];
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
  article: Article;
  articles: ArticlePagination;
  me: User;
  order: Order;
  orders: OrderPagination;
  permissions: Array<Permission>;
  product: Product;
  products: ProductPagination;
  role: Role;
  roles: RolePagination;
  signedFileUrl: SignedFileUrl;
  user: User;
  users: UserPagination;
  withdrawal: Withdrawal;
  withdrawals: WithdrawalPagination;
};


export type QueryArticleArgs = {
  id: Scalars['String']['input'];
};


export type QueryArticlesArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
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


export type QueryRoleArgs = {
  id: Scalars['String']['input'];
};


export type QueryRolesArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: RoleWhereInput;
};


export type QuerySignedFileUrlArgs = {
  filename: Scalars['String']['input'];
};


export type QueryUserArgs = {
  id: Scalars['String']['input'];
};


export type QueryUsersArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: UserWhereInput;
};


export type QueryWithdrawalArgs = {
  id: Scalars['String']['input'];
};


export type QueryWithdrawalsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<WithdrawalWhereInput>;
};

export type Role = {
  __typename?: 'Role';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  isActive?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  permissions?: Maybe<Array<Scalars['String']['output']>>;
  updatedAt: Scalars['DateTime']['output'];
};

export type RolePagination = {
  __typename?: 'RolePagination';
  data: Array<Role>;
  total: Scalars['Int']['output'];
};

export type RoleWhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
};

export type SignedFileUrl = {
  __typename?: 'SignedFileUrl';
  downloadUrl: Scalars['String']['output'];
  uploadUrl: Scalars['String']['output'];
};

export type UpdateArticleInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateProductInput = {
  commission?: InputMaybe<Scalars['Float']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  images?: InputMaybe<Array<Scalars['String']['input']>>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
  sort?: InputMaybe<Scalars['Int']['input']>;
  stock?: InputMaybe<Scalars['Int']['input']>;
  title: Scalars['String']['input'];
};

export type UpdateRoleInput = {
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  permissions?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type UpdateUserInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  roleIds?: InputMaybe<Array<Scalars['String']['input']>>;
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
  isActive?: Maybe<Scalars['Boolean']['output']>;
  isAdmin?: Maybe<Scalars['Boolean']['output']>;
  links?: Maybe<Array<Link>>;
  name?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  products?: Maybe<Array<Product>>;
  roles?: Maybe<Array<Role>>;
  slug?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  wechatId?: Maybe<Scalars['String']['output']>;
  wechatMerchantId?: Maybe<Scalars['String']['output']>;
  wechatMerchantStatus?: Maybe<WechatMerchantStatus>;
  wechatOpenId?: Maybe<Scalars['String']['output']>;
};

export type UserPagination = {
  __typename?: 'UserPagination';
  data: Array<User>;
  total: Scalars['Int']['output'];
};

export type UserWhereInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
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
  userId?: InputMaybe<Scalars['String']['input']>;
};
