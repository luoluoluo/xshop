import { useTranslate } from "@refinedev/core";
import { Form, FormProps, Input, Select, Switch } from "antd";
import {
  Merchant,
  MerchantPagination,
  ProductCategory,
  ProductCategoryPagination,
} from "../../../generated/graphql";
import { useEffect, useState } from "react";
import { request } from "../../../utils/request";
import { getProductCategories } from "../../../requests/product-category";
import { CustomUpload } from "../../../components/custom-upload";
import { getMerchants } from "../../../requests/merchant";

export const ProductCategoryForm = ({
  formProps,
}: {
  formProps: FormProps;
}) => {
  const t = useTranslate();

  const [merchants, setMerchants] = useState<Merchant[]>();

  useEffect(() => {
    request<{ merchants?: MerchantPagination }>({
      query: getMerchants,
    }).then((res) => {
      setMerchants(res.data?.merchants?.data || []);
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
        label={t("product.fields.merchant")}
        name={["merchantId"]}
        rules={[{ required: true }]}
      >
        <Select
          options={
            merchants?.map((item) => ({
              label: item.name,
              value: item.id,
              disabled: !item.isActive,
            })) || []
          }
        />
      </Form.Item>
      <Form.Item label={t("productCategory.fields.image")} name="image">
        <CustomUpload />
      </Form.Item>
      <Form.Item
        label={t("productCategory.fields.name")}
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
