import { Link, LinkPagination, LinkWhereInput } from "@/generated/graphql";
import { request } from "../utils/request.client";
import { LINKS_QUERY, LINK_QUERY } from "./link.graphql";

export const getLinks = (variables: {
  where?: LinkWhereInput;
  skip?: number;
  take?: number;
  sorters: Array<{ field: string; direction: "ASC" | "DESC" }>;
}) => {
  return request<{ links: LinkPagination }>({
    query: LINKS_QUERY,
    variables,
  });
};

export const getLink = (variables: { id: string }) => {
  return request<{ link: Link }>({
    query: LINK_QUERY,
    variables,
  });
};
