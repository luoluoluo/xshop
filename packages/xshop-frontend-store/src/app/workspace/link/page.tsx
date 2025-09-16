"use client";

import React, { useState, useEffect } from "react";
import {
  List,
  Card,
  Button,
  Popconfirm,
  message,
  Breadcrumb,
  Image,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getLinks, deleteLink } from "@/requests/link.client";
import {
  Link as LinkType,
  LinkPagination,
  LinkWhereInput,
} from "@/generated/graphql";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LinkListPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [linkPagination, setLinkPagination] = useState<LinkPagination>();

  const [linkVariables, setLinkVariables] = useState<{
    where?: LinkWhereInput;
    skip?: number;
    take?: number;
    sorters: Array<{ field: string; direction: "ASC" | "DESC" }>;
  }>({
    skip: 0,
    take: 10,
    sorters: [{ field: "sort", direction: "ASC" }],
  });

  // 获取链接列表
  const fetchLinks = async () => {
    setLoading(true);
    try {
      const response = await getLinks(linkVariables);

      if (response.data) {
        setLinkPagination(response.data.links);
      }
    } catch (error) {
      message.error("获取链接列表失败");
      console.error("Error fetching links:", error);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    void fetchLinks();
  }, [linkVariables]);

  // 删除链接
  const handleDelete = async (id: string) => {
    try {
      await deleteLink({ id });
      void fetchLinks();
      message.success("删除成功");
    } catch (error) {
      message.error("删除失败");
      console.error("Error deleting link:", error);
    }
  };

  // 新增链接
  const handleAdd = () => {
    router.push("/workspace/link/create");
  };

  // 编辑链接
  const handleEdit = (link: LinkType) => {
    router.push(`/workspace/link/edit?id=${link.id}`);
  };

  return (
    <>
      <Breadcrumb className="!mb-4">
        <Breadcrumb.Item>
          <Link href="/workspace">工作台</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>链接列表</Breadcrumb.Item>
      </Breadcrumb>
      <Button
        className="w-full"
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleAdd}
      >
        新增链接
      </Button>
      <List
        loading={loading || !linkPagination}
        className="!mt-4"
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 2,
          lg: 2,
          xl: 2,
          xxl: 2,
        }}
        pagination={{
          total: linkPagination?.total,
          pageSize: linkVariables.take ?? 10,
          current: (linkVariables.skip ?? 0) / (linkVariables.take ?? 10) + 1,
          onChange: (page, pageSize) => {
            setLinkVariables({
              ...linkVariables,
              skip: (page - 1) * pageSize,
              take: pageSize,
            });
          },
        }}
        dataSource={linkPagination?.data}
        renderItem={(link) => (
          <List.Item>
            <Card
              key={link.id}
              actions={[
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(link)}
                >
                  编辑
                </Button>,
                <Popconfirm
                  title="确定删除吗？"
                  onConfirm={() => void handleDelete(link.id)}
                >
                  <Button danger type="link" icon={<DeleteOutlined />}>
                    删除
                  </Button>
                </Popconfirm>,
              ]}
            >
              <Card.Meta
                title={link.name}
                description={
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500 truncate">
                      链接: {link.url}
                    </div>
                    {link.qrcode && (
                      <div className="flex items-center gap-1">
                        二维码:
                        <Image src={link.qrcode} className="!w-4 !h-auto" />
                      </div>
                    )}
                    <div className="text-xs text-gray-500 truncate">
                      平台名称: {link.name}
                    </div>
                    {link.logo && (
                      <div className="flex items-center gap-1">
                        平台logo:
                        <Image src={link.logo} className="!w-4 !h-auto" />
                      </div>
                    )}
                    <div className="text-xs text-gray-500 truncate">
                      排序: {link.sort}
                    </div>
                  </div>
                }
              />
            </Card>
          </List.Item>
        )}
      />
    </>
  );
}
