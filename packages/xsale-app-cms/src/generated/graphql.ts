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
  isActive: Scalars['Boolean']['output'];
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
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['String']['output'];
  image: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  sort: Scalars['Float']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type ArticleCategory = {
  __typename?: 'ArticleCategory';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
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
  expiresIn: Scalars['Float']['output'];
  token: Scalars['String']['output'];
  user: User;
};

export type Banner = {
  __typename?: 'Banner';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  image: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
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
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  merchantId?: InputMaybe<Scalars['String']['input']>;
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

export type CreateBannerInput = {
  image: Scalars['String']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  link?: InputMaybe<Scalars['String']['input']>;
  merchantId: Scalars['String']['input'];
  sort: Scalars['Int']['input'];
  title: Scalars['String']['input'];
};

export type CreateMerchantInput = {
  address: Scalars['String']['input'];
  affiliateId: Scalars['String']['input'];
  description: Scalars['String']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  logo: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phone: Scalars['String']['input'];
};

export type CreateProductCategoryInput = {
  image?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  merchantId: Scalars['String']['input'];
  name: Scalars['String']['input'];
  sort: Scalars['Int']['input'];
};

export type CreateProductInput = {
  attributes?: InputMaybe<Array<ProductAttributeInput>>;
  categoryId?: InputMaybe<Scalars['String']['input']>;
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
  isActive: Scalars['Boolean']['output'];
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
  address: Scalars['String']['output'];
  affiliate?: Maybe<Affiliate>;
  affiliateId?: Maybe<Scalars['String']['output']>;
  balance: Scalars['Float']['output'];
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
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
  affiliateId?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
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
  createBanner: Banner;
  createMerchant: Merchant;
  createProduct: Product;
  createProductCategory: ProductCategory;
  createRole: Role;
  createUser: User;
  deleteAffiliate: Scalars['Boolean']['output'];
  deleteArticle: Scalars['Boolean']['output'];
  deleteArticleCategory: Scalars['Boolean']['output'];
  deleteBanner: Scalars['Boolean']['output'];
  deleteMerchant: Scalars['Boolean']['output'];
  deleteProduct: Scalars['Boolean']['output'];
  deleteProductCategory: Scalars['Boolean']['output'];
  deleteRole: Scalars['Boolean']['output'];
  deleteUser: Scalars['Boolean']['output'];
  login: AuthToken;
  rejectAffiliateWithdrawal: AffiliateWithdrawal;
  rejectMerchantWithdrawal: MerchantWithdrawal;
  updateAffiliate: Affiliate;
  updateArticle: Article;
  updateArticleCategory: ArticleCategory;
  updateBanner: Banner;
  updateMerchant: Merchant;
  updateProduct: Product;
  updateProductCategory: ProductCategory;
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


export type MutationCreateBannerArgs = {
  data: CreateBannerInput;
};


export type MutationCreateMerchantArgs = {
  data: CreateMerchantInput;
};


export type MutationCreateProductArgs = {
  data: CreateProductInput;
};


export type MutationCreateProductCategoryArgs = {
  data: CreateProductCategoryInput;
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


export type MutationDeleteBannerArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteMerchantArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteProductArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteProductCategoryArgs = {
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


export type MutationUpdateBannerArgs = {
  data: UpdateBannerInput;
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


export type MutationUpdateProductCategoryArgs = {
  data: UpdateProductCategoryInput;
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
  affiliateId?: InputMaybe<Scalars['String']['input']>;
  code?: InputMaybe<Scalars['String']['input']>;
  createdAtEnd?: InputMaybe<Scalars['DateTime']['input']>;
  createdAtStart?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  merchantId?: InputMaybe<Scalars['String']['input']>;
  productId?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<OrderStatus>;
  userId?: InputMaybe<Scalars['String']['input']>;
};

export type Permission = {
  __typename?: 'Permission';
  action: Scalars['String']['output'];
  resource: Scalars['String']['output'];
  value: Scalars['String']['output'];
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
  isActive: Scalars['Boolean']['output'];
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

export type ProductAttributeInput = {
  name: Scalars['String']['input'];
  sort: Scalars['Int']['input'];
  values: Array<Scalars['String']['input']>;
};

export type ProductCategory = {
  __typename?: 'ProductCategory';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  image?: Maybe<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
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
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
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
  affiliate: Affiliate;
  affiliateWithdrawal: AffiliateWithdrawal;
  affiliateWithdrawals: AffiliateWithdrawalPagination;
  affiliates: AffiliatePagination;
  article: Article;
  articleCategories: ArticleCategoryPagination;
  articleCategory: ArticleCategory;
  articles: ArticlePagination;
  banner: Banner;
  banners: BannerPagination;
  me: User;
  merchant: Merchant;
  merchantWithdrawal: MerchantWithdrawal;
  merchantWithdrawals: MerchantWithdrawalPagination;
  merchants: MerchantPagination;
  order: Order;
  orders: OrderPagination;
  permissions: Array<Permission>;
  product: Product;
  productCategories: ProductCategoryPagination;
  productCategory: ProductCategory;
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


export type QueryBannerArgs = {
  id: Scalars['String']['input'];
};


export type QueryBannersArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: BannerWhereInput;
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
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  permissions: Array<Scalars['String']['output']>;
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

export type UpdateBannerInput = {
  image?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  link?: InputMaybe<Scalars['String']['input']>;
  merchantId?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateMerchantInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  affiliateId?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  logo?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateProductCategoryInput = {
  image?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  merchantId?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateProductInput = {
  attributes?: InputMaybe<Array<ProductAttributeInput>>;
  categoryId?: InputMaybe<Scalars['String']['input']>;
  commission?: InputMaybe<Scalars['Float']['input']>;
  content: Scalars['String']['input'];
  image?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  merchantId?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
  sort: Scalars['Int']['input'];
  stock?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
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
  balance: Scalars['Float']['output'];
  createdAt: Scalars['DateTime']['output'];
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
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
