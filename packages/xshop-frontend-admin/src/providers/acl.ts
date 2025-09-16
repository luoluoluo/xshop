import { AccessControlProvider } from "@refinedev/core";
import { authProvider } from "./auth";
import { getResources } from "../config/app";

export const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action }) => {
    // 获取当前用户权限
    const permissions = authProvider.getPermissions
      ? ((await authProvider.getPermissions()) as string[])
      : undefined;

    if (permissions?.includes("*")) {
      return { can: true };
    }
    const getPermission = (resource?: string) => {
      if (resource?.includes(".")) {
        resource = resource.split(".")[1];
      }
      return `${resource}.${action}`;
    };
    const permission = getPermission(resource);

    if (permissions?.includes(permission)) {
      return { can: true };
    }
    // 获取所有子菜单
    const getChildrenResources = (resource?: string) => {
      const resources: string[] = [];
      const rs = getResources();
      rs.map((r) => {
        if (r.meta?.parent === resource) {
          resources.push(r.name);
          resources.push(...getChildrenResources(r.name));
        }
      });
      return resources;
    };
    const resources = getChildrenResources(resource);
    // 判断子菜单是否有权限
    for (resource of resources) {
      const permission = getPermission(resource);
      if (permissions?.includes(permission)) {
        return { can: true };
      }
    }
    return {
      can: false,
      reason: "Unauthorized: You don't have permission to perform this action",
    };
  },
};
