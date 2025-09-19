import { Article, ArticlePagination } from "@/generated/graphql";
import { request } from "../utils/request.client";
import { ARTICLES_QUERY, ARTICLE_QUERY } from "./article.graphql";

export const getArticles = (variables: { skip?: number; take?: number }) => {
  return request<{ articles: ArticlePagination }>({
    query: ARTICLES_QUERY,
    variables,
  });
};

export const getArticle = (variables: { slug: string }) => {
  return request<{ article: Article }>({
    query: ARTICLE_QUERY,
    variables,
  });
};
