# Analytics Module - TrackView 接口优化

## 概述

`trackView` 接口已经优化，现在只需要前端传递最少的必要信息，后端会自动分析并获取所有相关信息。

## 接口变化

### 之前 (复杂)

```graphql
mutation TrackView($data: TrackViewInput!) {
  trackView(data: $data) {
    id
    pageType
    pageUrl
    # ... 其他字段
  }
}
```

前端需要传递：

```typescript
{
  userId: "user123",
  productId: "product456",
  articleId: "article789",
  creatorId: "creator101",
  ipAddress: "192.168.1.1",
  userAgent: "Mozilla/5.0...",
  referer: "https://example.com",
  pageType: "product",
  pageUrl: "https://store.example.com/product/456"
}
```

### 现在 (简化)

```graphql
mutation TrackView($data: TrackViewInput!) {
  trackView(data: $data) {
    id
    pageType
    pageUrl
    productId
    articleId
    creatorId
    ipAddress
    userAgent
    referer
    # ... 其他字段
  }
}
```

前端只需要传递：

```typescript
{
  userId: "user123", // 可选，如果用户已登录
  pageUrl: "https://store.example.com/product/456"
}
```

## 自动分析功能

后端会自动从 `pageUrl` 分析出：

### 1. 页面类型 (pageType)

- `product`: `/product/[pid]`
- `article`: `/article/[slug]`
- `user`: `/[slug]`
- `home`: `/`
- `unknown`: 其他

### 2. 相关 ID

- **商品页面**: 自动获取 `productId` 和 `creatorId`
- **文章页面**: 自动获取 `articleId` 和 `creatorId`
- **用户页面**: 自动获取 `userId` 和 `creatorId`

### 3. 客户端信息

后端自动从请求头获取：

- `ipAddress`: 支持多种代理头 (x-forwarded-for, x-real-ip 等)
- `userAgent`: 从 User-Agent 头获取
- `referer`: 从 Referer/Referrer 头获取

## URL 解析规则

### 商品页面

```
URL: https://store.example.com/product/abc123
解析结果:
- pageType: "product"
- productId: "abc123"
- creatorId: 通过数据库查询获取
```

### 文章页面

```
URL: https://store.example.com/article/my-article-slug
解析结果:
- pageType: "article"
- articleId: "my-article-slug" (slug)
- creatorId: 通过数据库查询获取
```

### 用户页面

```
URL: https://store.example.com/john-doe
解析结果:
- pageType: "user"
- userId: "john-doe" (slug)
- creatorId: 通过数据库查询获取
```

### 首页

```
URL: https://store.example.com/
解析结果:
- pageType: "home"
```

## 使用示例

### 前端调用

```typescript
// 商品页面浏览
const trackProductView = async (productUrl: string) => {
  await trackView({
    pageUrl: productUrl,
    // userId 可选，如果用户已登录
  });
};

// 文章页面浏览
const trackArticleView = async (articleUrl: string) => {
  await trackView({
    pageUrl: articleUrl,
  });
};

// 用户页面浏览
const trackUserView = async (userUrl: string) => {
  await trackView({
    pageUrl: userUrl,
  });
};
```

### 后端处理流程

1. 接收 `pageUrl` 和可选的 `userId`
2. 解析 URL 获取页面类型
3. 根据页面类型查询数据库获取相关 ID
4. 从请求头获取客户端信息
5. 保存完整的浏览记录

## 优势

1. **简化前端**: 前端只需要传递 URL，无需手动分析
2. **自动获取**: 后端自动获取 IP、User-Agent、Referer
3. **智能分析**: 自动分析页面类型和相关 ID
4. **数据完整**: 确保所有必要信息都被正确记录
5. **易于维护**: URL 规则集中管理，便于扩展
