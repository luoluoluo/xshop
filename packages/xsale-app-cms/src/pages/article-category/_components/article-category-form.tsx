import { useTranslate } from "@refinedev/core";
import { Form, FormProps, Input, Select, Switch } from "antd";
import {
  ArticleCategory,
  ArticleCategoryPagination,
} from "../../../generated/graphql";
import { useEffect, useState } from "react";
import { request } from "../../../utils/request";
import { getArticleCategories } from "../../../requests/article-category";

export const ArticleCategoryForm = ({
  formProps,
}: {
  formProps: FormProps;
}) => {
  const t = useTranslate();
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  useEffect(() => {
    request<{ articleCategories?: ArticleCategoryPagination }>({
      query: getArticleCategories,
    }).then((res) => {
      setCategories(
        res.data?.articleCategories?.data?.filter(
          (item) => item.id !== formProps?.initialValues?.id && !item.parentId,
        ) || [],
      );
    });
  }, [formProps?.initialValues?.id]);

  const onFinish = (values: any) => {
    values.sort = Number(values?.sort || 0);
    if (formProps.onFinish) {
      formProps.onFinish(values);
    }
  };

  return (
    <Form {...{ ...formProps, onFinish }} layout="vertical">
      {categories.length ? (
        <Form.Item
          label={t("articleCategory.fields.parent")}
          name={["parentId"]}
        >
          <Select
            allowClear
            onChange={(value) => {
              if (!value) {
                formProps.form?.setFieldValue("parentId", null);
              }
            }}
          >
            {categories.map((category) => (
              <Select.Option key={category.id} value={category.id}>
                {category.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      ) : null}

      <Form.Item
        label={t("articleCategory.fields.name")}
        name={["name"]}
        rules={[{ required: true }]}
      >
        <Input />
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
