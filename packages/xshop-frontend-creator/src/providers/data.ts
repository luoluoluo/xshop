import { BaseRecord, DataProvider } from "@refinedev/core";
import { DocumentNode } from "graphql";
import { request } from "../utils/request";
const getOperation = (doc: DocumentNode) => {
  return (doc.definitions[0] as any).selectionSet.selections[0].name.value;
};
export const dataProvider = (): Required<DataProvider> => {
  return {
    getList: async ({ pagination, meta }) => {
      const list = {
        data: [],
        total: 0,
      };
      const { currentPage = 1, pageSize = 10, mode } = pagination ?? {};
      if (!meta?.gqlQuery) {
        return list;
      }
      const operation = getOperation(meta.gqlQuery);

      const variables: { [key: string]: any } = {
        ...meta?.variables,
      };
      if (mode === "server") {
        variables.take = pageSize;
        variables.skip = (currentPage - 1) * pageSize;
      }
      const response = await request<BaseRecord>({
        query: meta.gqlQuery,
        variables,
      });
      if (response.errors) {
        return Promise.reject({
          message: response.errors[0].message,
          statusCode: response.errors[0].extensions?.statusCode,
          extensions: {
            code: response.errors[0].extensions?.code,
          },
        });
      }
      list.data = response.data ? response.data[operation].data : [];
      list.total = response.data ? response.data[operation].total : 0;
      return list;
    },

    create: async ({ variables, meta }) => {
      const created: { data: any } = {
        data: undefined,
      };
      if (!meta?.gqlMutation) {
        return created;
      }
      const operation = getOperation(meta.gqlMutation);
      const response = await request<BaseRecord>({
        query: meta?.gqlMutation,
        variables: {
          data: { ...variables },
        },
      });

      if (response.errors) {
        return Promise.reject({
          message: response.errors[0].message,
          statusCode: response.errors[0].extensions?.statusCode,
          extensions: {
            code: response.errors[0].extensions?.code,
          },
        });
      }

      created.data = response.data ? response.data[operation] : undefined;
      return created;
    },

    update: async ({ id, variables, meta }) => {
      const updated: { data: any } = {
        data: undefined,
      };
      if (!meta?.gqlMutation) {
        return updated;
      }
      const operation = getOperation(meta.gqlMutation);

      const response = await request<BaseRecord>({
        query: meta.gqlMutation,
        variables: {
          id,
          data: {
            ...variables,
          },
        },
      });

      if (response.errors) {
        return Promise.reject({
          message: response.errors[0].message,
          statusCode: response.errors[0].extensions?.statusCode,
          extensions: {
            code: response.errors[0].extensions?.code,
          },
        });
      }

      updated.data = response.data ? response.data[operation] : undefined;
      return updated;
    },

    createMany: ({ resource, variables, meta }) => {
      console.log(resource, variables, meta);
      throw Error("createMany not implemented");
    },

    updateMany: ({ resource, ids, variables, meta }) => {
      console.log(resource, ids, variables, meta);
      throw Error("updateMany not implemented");
    },
    getMany: ({ resource, ids, meta }) => {
      console.log(resource, ids, meta);
      throw Error("getMany not implemented");
    },

    getOne: async ({ id, meta }) => {
      const one: {
        data: any;
      } = {
        data: undefined,
      };
      if (!meta?.gqlQuery) {
        return one;
      }
      console.log(meta?.gqlQuery?.definitions[0]);
      const operation = getOperation(meta.gqlQuery);

      const response = await request<BaseRecord>({
        query: meta.gqlQuery,
        variables: {
          id,
        },
      });
      if (response.errors) {
        return Promise.reject({
          message: response.errors[0].message,
          statusCode: response.errors[0].extensions?.statusCode,
          extensions: {
            code: response.errors[0].extensions?.code,
          },
        });
      }
      one.data = response.data ? response.data[operation] : undefined;
      return one;
    },

    deleteOne: async ({ id, meta }) => {
      const deleted: { data: any } = {
        data: undefined,
      };
      if (!meta?.gqlMutation) {
        return deleted;
      }
      const operation = getOperation(meta.gqlMutation);
      const response = await request<BaseRecord>({
        query: meta.gqlMutation,
        variables: {
          id,
        },
      });
      if (response.errors) {
        return Promise.reject({
          message: response.errors[0].message,
          statusCode: response.errors[0].extensions?.statusCode,
          extensions: {
            code: response.errors[0].extensions?.code,
          },
        });
      }
      deleted.data = response.data ? response.data[operation] : undefined;
      return deleted;
    },

    deleteMany: ({ resource, ids, meta }) => {
      console.log(resource, ids, meta);
      throw Error("deleteMany not implemented");
    },

    getApiUrl: () => {
      throw Error("Not implemented on refine-graphql data provider.");
    },

    custom: ({ url, method, headers, meta }) => {
      console.log(url, method, headers, meta);
      throw Error("custom not implemented");
    },
  };
};

export default dataProvider;
