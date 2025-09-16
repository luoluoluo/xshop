import { Article, ArticlePagination } from "@/generated/graphql";
import { request } from "../utils/request.server";
import { ARTICLES_QUERY, ARTICLE_QUERY } from "./article.graphql";

export const GET_ARTICLES = (variables: { skip?: number; take?: number }) => {
  return request<{ articles: ArticlePagination }>({
    query: ARTICLES_QUERY,
    variables,
  });
};

export const GET_ARTICLE = (variables: { slug: string }) => {
  return request<{ article: Article }>({
    query: ARTICLE_QUERY,
    variables,
  });
};
