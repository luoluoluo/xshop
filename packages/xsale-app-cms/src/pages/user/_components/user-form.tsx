import { Create, useForm } from "@refinedev/antd";
import { Form, FormProps, Input, Select, Switch } from "antd";
import { parse } from "graphql";
import { Role, RolePagination } from "../../../generated/graphql";
import { md5 } from "js-md5";
import { useEffect, useState } from "react";
import { request } from "../../../utils/request";
import { getRoles } from "../../../requests/role";
import { useTranslate } from "@refinedev/core";
export const UserForm = ({ formProps }: { formProps: FormProps }) => {
  const t = useTranslate();
  const [roles, setRoles] = useState<Role[]>();

  useEffect(() => {
    request<{ roles?: RolePagination }>({
      query: getRoles,
    }).then((res) => {
      setRoles(res.data?.roles?.data || []);
    });
  }, []);
  return (
    <Form {...{ ...formProps }} layout="vertical">
      <Form.Item
        label={t("user.fields.name")}
        name={["name"]}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={t("user.fields.email")}
        name={["email"]}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item label={t("user.fields.phone")} name={["phone"]}>
        <Input />
      </Form.Item>
      <Form.Item
        label={t("user.fields.password")}
        name={["password"]}
        extra={formProps.initialValues?.id ? "非必填，填写后会修改密码" : ""}
      >
        <Input />
      </Form.Item>
      <Form.Item label={t("user.fields.roles")} name="roleIds">
        <Select
          options={roles?.map((item) => ({
            label: item.name,
            value: item.id,
            disabled: !item.isActive,
          }))}
          mode="multiple"
        />
      </Form.Item>
      <Form.Item label={t("user.fields.isActive.label")} name={["isActive"]}>
        <Switch />
      </Form.Item>
    </Form>
  );
};
