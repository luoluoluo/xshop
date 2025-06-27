import { Form, FormProps, Input, Switch, TreeSelect } from "antd";
import { CustomUpload } from "../../../components/custom-upload";
import { CustomEditor } from "../../../components/custom-editor";
import { useEffect, useState } from "react";
import {
  ArticleCategory,
  ArticleCategoryPagination,
} from "../../../generated/graphql";
import { getArticleCategories } from "../../../requests/article-category";
import { request } from "../../../utils/request";
import { arrayToTree } from "../../../utils/tree";
import { useTranslate } from "@refinedev/core";

export const ArticleForm = ({ formProps }: { formProps: FormProps }) => {
  const t = useTranslate();
  const [categories, setCategories] = useState<ArticleCategory[]>();
  useEffect(() => {
    request<{ articleCategories?: ArticleCategoryPagination }>({
      query: getArticleCategories,
    }).then((res) => {
      setCategories(res.data?.articleCategories?.data || []);
    });
  }, []);
  const onFinish = (values: any) => {
    values.sort = Number(values?.sort || 0);
    if (formProps.onFinish) {
      formProps.onFinish(values);
    }
  };
  return (
    <Form {...{ ...formProps, onFinish }} layout="vertical">
      <Form.Item
        label={t("article.fields.category")}
        name={["categoryId"]}
        rules={[{ required: true }]}
      >
        <TreeSelect
          treeData={arrayToTree(
            (categories?.map((item) => ({
              id: item.id,
              parentId: item.parentId,
              key: item.id,
              title: item.name,
              label: item.name,
              value: item.id,
              disabled: !item.isActive,
            })) as any) || [],
          )}
        />
      </Form.Item>
      <Form.Item
        label={t("article.fields.image")}
        name={["image"]}
        rules={[{ required: true }]}
      >
        <CustomUpload />
      </Form.Item>
      <Form.Item
        label={t("article.fields.title")}
        name={["title"]}
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={t("article.fields.description")}
        name={["description"]}
        rules={[{ required: true }]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item
        label={t("article.fields.content")}
        name={["content"]}
        rules={[{ required: true }]}
      >
        <CustomEditor />
      </Form.Item>
      <Form.Item
        label={t("fields.sort")}
        name={["sort"]}
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label={t("fields.isActive.label")} name={["isActive"]}>
        <Switch />
      </Form.Item>
    </Form>
  );
};
