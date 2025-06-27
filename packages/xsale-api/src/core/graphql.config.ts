import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import * as fs from 'fs';
import { GraphQLSchema, GraphQLObjectType, printSchema } from 'graphql';
import { Type } from '@nestjs/common';
import { CLIENT_TYPE_REGISTRY } from '@/decorators/client.decorator';

/**
 * Create GraphQL module configuration
 * @param options Configuration options
 * @returns ApolloDriverConfig
 */
export function createGraphQLConfig(options: {
  path: string;
  schemaPath: string;
  modules: Type<any>[];
  clientType: string;
}): ApolloDriverConfig {
  const schemaPath = join(process.cwd(), 'dist', options.schemaPath);

  const filterSchema = (schema: GraphQLSchema) => {
    if (!schema) {
      return schema;
    }

    const typeMap = schema.getTypeMap();

    // Create new schema with processed types
    return new GraphQLSchema({
      query: schema.getQueryType(),
      mutation: schema.getMutationType(),
      subscription: schema.getSubscriptionType(),
      types: Object.values(typeMap).filter((type) => {
        if (type.name.startsWith('__')) {
          return true;
        }

        if (type instanceof GraphQLObjectType) {
          // Check if type is in registry
          const typeClientTypes = CLIENT_TYPE_REGISTRY.get(type.name);

          if (
            typeClientTypes &&
            !typeClientTypes.includes(options.clientType)
          ) {
            return false;
          }

          // Process fields
          const fields = type.getFields();
          const fieldsToRemove = new Set<string>();

          Object.entries(fields).forEach(([fieldName]) => {
            const fieldKey = `${type.name}.${fieldName}`;
            const fieldClientTypes = CLIENT_TYPE_REGISTRY.get(fieldKey);

            if (
              fieldClientTypes &&
              !fieldClientTypes.includes(options.clientType)
            ) {
              fieldsToRemove.add(fieldName);
            }
          });

          // Remove filtered fields
          fieldsToRemove.forEach((fieldName) => {
            delete fields[fieldName];
          });

          return true;
        }

        return true;
      }),
    });
  };

  return {
    driver: ApolloDriver,
    context: (ctx) => {
      return {
        ...ctx,
        clientType: options.clientType,
      };
    },
    graphiql: true,
    playground: true,
    autoSchemaFile: schemaPath,
    path: options.path,
    debug: true,
    formatError: (error) => {
      /**  处理class-validator错误  start */
      const originalError = error.extensions?.originalError as {
        message?: string[] | string;
        statusCode?: number;
      };

      let message =
        (typeof originalError?.message === 'string'
          ? originalError.message
          : originalError?.message?.[0]) || error.message;
      let code = error.extensions?.code;

      if (message?.includes('::')) {
        [message, code] = message.split('::');
      }

      return {
        ...error,
        message,
        extensions: {
          ...error.extensions,
          statusCode: originalError?.statusCode || 500,
          message: message,
          code,
        },
      };
    },
    include: options.modules,
    transformSchema: (schema) => {
      const filteredSchema = filterSchema(schema);
      if (filteredSchema) {
        // 生成过滤后的 schema 文件
        fs.writeFileSync(schemaPath, printSchema(filteredSchema));
      }
      return filteredSchema;
    },
  };
}
