import { SetMetadata } from '@nestjs/common';

// Global registry to store type-client mappings
export const CLIENT_TYPE_REGISTRY = new Map<string, string[]>();

/**
 * Marks a type or field as client-specific
 * @param types The client type(s) this type/field is for. Can be a single type or an array of types.
 */
export function Client(
  types: string | string[],
): ClassDecorator & PropertyDecorator {
  const typeValues = Array.isArray(types) ? types : [types];

  return function (target: any, propertyKey?: string | symbol) {
    // Store type mapping in global registry
    const typeName = target.name || target.constructor.name;
    const key = propertyKey ? `${typeName}.${String(propertyKey)}` : typeName;

    CLIENT_TYPE_REGISTRY.set(key, typeValues);

    // For class decorators, also set metadata for compatibility
    if (!propertyKey) {
      SetMetadata('client-types', typeValues)(target);
    }
  };
}
