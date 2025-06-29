import { Form, FormProps, Input, Select, Switch } from "antd";
import { CustomUpload } from "../../../components/custom-upload";
import { useEffect, useState } from "react";
import { Affiliate, AffiliatePagination } from "../../../generated/graphql";
import { getAffiliates } from "../../../requests/affiliate";
import { request } from "../../../utils/request";
import { useTranslate } from "@refinedev/core";
import { CustomEditor } from "../../../components/custom-editor";

export const MerchantForm = ({ formProps }: { formProps: FormProps }) => {
  const t = useTranslate();
  const [affiliates, setAffiliates] = useState<Affiliate[]>();

  useEffect(() => {
    request<{ affiliates?: AffiliatePagination }>({
      query: getAffiliates,
    }).then((res) => {
      setAffiliates(res.data?.affiliates?.data || []);
    });
  }, []);

  const onFinish = (values: any) => {
    if (formProps.onFinish) {
      formProps.onFinish(values);
    }
  };

  return (
    <Form {...{ ...formProps, onFinish }} layout="vertical">
      <Form.Item
        label={t("merchant.fields.affiliate")}
        name={["affiliateId"]}
        rules={[{ required: true }]}
      >
        <Select
          allowClear
          options={affiliates?.map((affiliate) => ({
            label: affiliate.name,
            value: affiliate.id,
          }))}
        />
      </Form.Item>

      <Form.Item
        label={t("merchant.fields.logo")}
        name={["logo"]}
        rules={[{ required: true }]}
      >
        <CustomUpload />
      </Form.Item>

      <Form.Item
        label={t("merchant.fields.name")}
        name={["name"]}
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={t("merchant.fields.phone")}
        name={["phone"]}
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={t("merchant.fields.password")}
        name={["password"]}
        required={!formProps.initialValues?.id}
        rules={
          // eslint-disable-next-line prettier/prettier
          formProps.initialValues?.id ? undefined : [{ required: true }]
        }
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={t("merchant.fields.address")}
        name={["address"]}
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={t("merchant.fields.businessScope")}
        name={["businessScope"]}
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={t("merchant.fields.wechatQrcode")}
        name={["wechatQrcode"]}
        rules={[{ required: true }]}
      >
        <CustomUpload />
      </Form.Item>

      <Form.Item
        label={t("merchant.fields.description")}
        name={["description"]}
        rules={[{ required: true }]}
      >
        <CustomEditor />
      </Form.Item>

      <Form.Item label={t("fields.isActive.label")} name={["isActive"]}>
        <Switch />
      </Form.Item>
    </Form>
  );
};
