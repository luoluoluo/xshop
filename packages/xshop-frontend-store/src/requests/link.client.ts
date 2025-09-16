import {
  CreateLinkInput,
  Link,
  LinkPagination,
  LinkWhereInput,
  UpdateLinkInput,
} from "@/generated/graphql";
import { request } from "../utils/request.client";
import {
  LINKS_QUERY,
  LINK_QUERY,
  DELETE_LINK_MUTATION,
  CREATE_LINK_MUTATION,
  UPDATE_LINK_MUTATION,
} from "./link.graphql";

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

export const deleteLink = (variables: { id: string }) => {
  return request<{ deleteLink: boolean }>({
    query: DELETE_LINK_MUTATION,
    variables,
  });
};

export const createLink = (variables: { data: CreateLinkInput }) => {
  return request<{ createLink: Link }>({
    query: CREATE_LINK_MUTATION,
    variables,
  });
};

export const updateLink = (variables: {
  id: string;
  data: UpdateLinkInput;
}) => {
  return request<{ updateLink: Link }>({
    query: UPDATE_LINK_MUTATION,
    variables,
  });
};
