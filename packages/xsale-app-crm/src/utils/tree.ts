interface TreeNode {
  id: number | string;
  parentId: number | string | null;
  children?: TreeNode[]; // 可选字段
  [key: string]: any; // 允许其他属性
}

/**
 * 将扁平数组转换为树状结构
 * @param items 扁平数组
 * @param idKey 节点ID的键名，默认为'id'
 * @param parentIdKey 父节点ID的键名，默认为'parentId'
 * @param childrenKey 子节点数组的键名，默认为'children'
 * @returns 树状结构数组
 */
export function arrayToTree(
  items: TreeNode[],
  idKey: string = "id",
  parentIdKey: string = "parentId",
  childrenKey: string = "children",
): TreeNode[] {
  // 创建一个映射表，用于快速查找节点
  const itemMap: Record<string | number, TreeNode> = {};

  // 初始化所有节点
  items.forEach((item) => {
    itemMap[item[idKey]] = { ...item };
  });

  const tree: TreeNode[] = [];

  items.forEach((item) => {
    const itemId = item[idKey];
    const parentId = item[parentIdKey];

    // 查找当前节点在映射表中的引用
    const node = itemMap[itemId];

    if (parentId === null || parentId === undefined || !itemMap[parentId]) {
      // 如果没有父节点或父节点不存在，则作为根节点
      tree.push(node);
    } else {
      // 否则，将当前节点添加到父节点的children数组中
      if (!itemMap[parentId][childrenKey]) {
        itemMap[parentId][childrenKey] = [];
      }
      itemMap[parentId][childrenKey]!.push(node);
    }
  });

  // 移除空的children字段
  const removeEmptyChildren = (node: TreeNode) => {
    if (node[childrenKey] && node[childrenKey]!.length === 0) {
      delete node[childrenKey];
    } else if (node[childrenKey]) {
      node[childrenKey]!.forEach(removeEmptyChildren);
    }
    return node;
  };

  return tree.map(removeEmptyChildren);
}
