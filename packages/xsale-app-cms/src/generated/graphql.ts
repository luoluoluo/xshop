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
  balance?: Maybe<Scalars['Float']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  isActive?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type AffiliatePagination = {
  __typename?: 'AffiliatePagination';
  data: Array<Affiliate>;
  total: Scalars['Int']['output'];
};

export type AffiliateWhereInput = {
  affiliateId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
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
  affiliateId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<AffiliateWithdrawalStatus>;
};

export type Article = {
  __typename?: 'Article';
  category?: Maybe<ArticleCategory>;
  categoryId?: Maybe<Scalars['String']['output']>;
  content?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  image?: Maybe<Scalars['String']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  sort?: Maybe<Scalars['Float']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type ArticleCategory = {
  __typename?: 'ArticleCategory';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  isActive?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  parent?: Maybe<ArticleCategory>;
  parentId?: Maybe<Scalars['String']['output']>;
  sort?: Maybe<Scalars['Float']['output']>;
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
  expiresIn: Scalars['Float']['output'];
  token: Scalars['String']['output'];
  user: User;
};

export type CreateAffiliateInput = {
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phone: Scalars['String']['input'];
};

export type CreateArticleCategoryInput = {
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  parentId?: InputMaybe<Scalars['String']['input']>;
  sort: Scalars['Int']['input'];
};

export type CreateArticleInput = {
  categoryId: Scalars['String']['input'];
  content: Scalars['String']['input'];
  description: Scalars['String']['input'];
  image: Scalars['String']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  sort: Scalars['Int']['input'];
  title: Scalars['String']['input'];
};

export type CreateMerchantInput = {
  address: Scalars['String']['input'];
  affiliateId: Scalars['String']['input'];
  businessScope?: InputMaybe<Scalars['String']['input']>;
  description: Scalars['String']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  logo: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  wechatQrcode?: InputMaybe<Scalars['String']['input']>;
};

export type CreateProductInput = {
  commission: Scalars['Float']['input'];
  content: Scalars['String']['input'];
  image: Scalars['String']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  merchantId: Scalars['String']['input'];
  price: Scalars['Float']['input'];
  sort: Scalars['Int']['input'];
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

export type Customer = {
  __typename?: 'Customer';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  isActive?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Merchant = {
  __typename?: 'Merchant';
  address?: Maybe<Scalars['String']['output']>;
  affiliate?: Maybe<Affiliate>;
  affiliateId?: Maybe<Scalars['String']['output']>;
  balance?: Maybe<Scalars['Float']['output']>;
  businessScope?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isActive?: Maybe<Scalars['Boolean']['output']>;
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
  affiliateId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
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

export type MerchantWithdrawalPagination = {
  __typename?: 'MerchantWithdrawalPagination';
  data: Array<MerchantWithdrawal>;
  total: Scalars['Int']['output'];
};

export enum MerchantWithdrawalStatus {
  Approved = 'APPROVED',
  Completed = 'COMPLETED',
  Created = 'CREATED',
  Rejected = 'REJECTED'
}

export type MerchantWithdrawalWhereInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  merchantId?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<MerchantWithdrawalStatus>;
};

export type Mutation = {
  __typename?: 'Mutation';
  approveAffiliateWithdrawal: AffiliateWithdrawal;
  approveMerchantWithdrawal: MerchantWithdrawal;
  completeAffiliateWithdrawal: AffiliateWithdrawal;
  completeMerchantWithdrawal: MerchantWithdrawal;
  createAffiliate: Affiliate;
  createArticle: Article;
  createArticleCategory: ArticleCategory;
  createMerchant: Merchant;
  createProduct: Product;
  createRole: Role;
  createUser: User;
  deleteAffiliate: Scalars['Boolean']['output'];
  deleteArticle: Scalars['Boolean']['output'];
  deleteArticleCategory: Scalars['Boolean']['output'];
  deleteMerchant: Scalars['Boolean']['output'];
  deleteProduct: Scalars['Boolean']['output'];
  deleteRole: Scalars['Boolean']['output'];
  deleteUser: Scalars['Boolean']['output'];
  login: AuthToken;
  rejectAffiliateWithdrawal: AffiliateWithdrawal;
  rejectMerchantWithdrawal: MerchantWithdrawal;
  updateAffiliate: Affiliate;
  updateArticle: Article;
  updateArticleCategory: ArticleCategory;
  updateMerchant: Merchant;
  updateProduct: Product;
  updateRole: Role;
  updateUser: User;
};


export type MutationApproveAffiliateWithdrawalArgs = {
  id: Scalars['String']['input'];
};


export type MutationApproveMerchantWithdrawalArgs = {
  id: Scalars['String']['input'];
};


export type MutationCompleteAffiliateWithdrawalArgs = {
  id: Scalars['String']['input'];
};


export type MutationCompleteMerchantWithdrawalArgs = {
  id: Scalars['String']['input'];
};


export type MutationCreateAffiliateArgs = {
  data: CreateAffiliateInput;
};


export type MutationCreateArticleArgs = {
  data: CreateArticleInput;
};


export type MutationCreateArticleCategoryArgs = {
  data: CreateArticleCategoryInput;
};


export type MutationCreateMerchantArgs = {
  data: CreateMerchantInput;
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


export type MutationDeleteAffiliateArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteArticleArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteArticleCategoryArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteMerchantArgs = {
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


export type MutationRejectAffiliateWithdrawalArgs = {
  id: Scalars['String']['input'];
  rejectReason: Scalars['String']['input'];
};


export type MutationRejectMerchantWithdrawalArgs = {
  id: Scalars['String']['input'];
  rejectReason: Scalars['String']['input'];
};


export type MutationUpdateAffiliateArgs = {
  data: UpdateAffiliateInput;
  id: Scalars['String']['input'];
};


export type MutationUpdateArticleArgs = {
  data: UpdateArticleInput;
  id: Scalars['String']['input'];
};


export type MutationUpdateArticleCategoryArgs = {
  data: UpdateArticleCategoryInput;
  id: Scalars['String']['input'];
};


export type MutationUpdateMerchantArgs = {
  data: UpdateMerchantInput;
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
  affiliateCommission?: Maybe<Scalars['Float']['output']>;
  commission?: Maybe<Scalars['Float']['output']>;
  content?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  image?: Maybe<Scalars['String']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  merchant?: Maybe<Merchant>;
  merchantAffiliateCommission?: Maybe<Scalars['Float']['output']>;
  merchantId?: Maybe<Scalars['String']['output']>;
  platformCommission?: Maybe<Scalars['Float']['output']>;
  price?: Maybe<Scalars['Float']['output']>;
  sort?: Maybe<Scalars['Int']['output']>;
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
  title?: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
  __typename?: 'Query';
  affiliate: Affiliate;
  affiliateWithdrawal: AffiliateWithdrawal;
  affiliateWithdrawals: AffiliateWithdrawalPagination;
  affiliates: AffiliatePagination;
  article: Article;
  articleCategories: ArticleCategoryPagination;
  articleCategory: ArticleCategory;
  articles: ArticlePagination;
  me: User;
  merchant: Merchant;
  merchantWithdrawal: MerchantWithdrawal;
  merchantWithdrawals: MerchantWithdrawalPagination;
  merchants: MerchantPagination;
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
};


export type QueryAffiliateArgs = {
  id: Scalars['String']['input'];
};


export type QueryAffiliateWithdrawalArgs = {
  id: Scalars['String']['input'];
};


export type QueryAffiliateWithdrawalsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<AffiliateWithdrawalWhereInput>;
};


export type QueryAffiliatesArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<AffiliateWhereInput>;
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


export type QueryMerchantArgs = {
  id: Scalars['String']['input'];
};


export type QueryMerchantWithdrawalArgs = {
  id: Scalars['String']['input'];
};


export type QueryMerchantWithdrawalsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<MerchantWithdrawalWhereInput>;
};


export type QueryMerchantsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<MerchantWhereInput>;
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

export type UpdateAffiliateInput = {
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateArticleCategoryInput = {
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  parentId?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateArticleInput = {
  categoryId: Scalars['String']['input'];
  content?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  sort: Scalars['Int']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateMerchantInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  affiliateId?: InputMaybe<Scalars['String']['input']>;
  businessScope?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  logo?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  wechatQrcode?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateProductInput = {
  commission?: InputMaybe<Scalars['Float']['input']>;
  content: Scalars['String']['input'];
  image: Scalars['String']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  merchantId?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
  sort: Scalars['Int']['input'];
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
  name?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  roleIds?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime']['output'];
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isActive?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  roles?: Maybe<Array<Role>>;
  updatedAt: Scalars['DateTime']['output'];
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
