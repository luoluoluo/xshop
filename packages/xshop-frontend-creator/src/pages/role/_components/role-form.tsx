import {
  Checkbox,
  CheckboxOptionType,
  Col,
  Form,
  Input,
  message,
  Row,
  Switch,
} from "antd";
import { request } from "../../../utils/request";
import { Permission } from "../../../generated/graphql";
import { GET_PERMISSIONS_QUERY } from "../../../requests/permission";
import { useEffect, useState } from "react";
import { useTranslate } from "@refinedev/core";
import { FormProps } from "antd/lib";

interface PermissionGroup {
  label: string;
  value: string;
  items?: PermissionGroup[];
}

export const PermissionCheckbox = ({
  value,
  onChange,
}: {
  value?: string[];
  onChange?: (value: string[]) => void;
}) => {
  // const { form, formProps, saveButtonProps } = useForm({});
  const [permissionOptions, setPermissionOptions] = useState<PermissionGroup[]>(
    [],
  );

  const loadPermissions = async () => {
    const res = await request<{ permissions?: Permission[] }>({
      query: GET_PERMISSIONS_QUERY,
    });
    if (res.errors) {
      message.error(res.errors[0].message);
      return;
    }
    if (res.data?.permissions) {
      const options: PermissionGroup[] = [];
      res.data.permissions.map((p) => {
        const [r] = p.value.split(".");

        const index = options.findIndex((o) => o.value === r);
        if (index === -1) {
          options.push({
            label: p.resource,
            value: r,
            items: [
              {
                label: p.action,
                value: p.value,
              },
            ],
          });
        } else {
          options?.[index]?.items?.push({
            label: p.action,
            value: p.value,
          });
        }
      });

      setPermissionOptions(options);
    }
  };

  useEffect(() => {
    loadPermissions();
  }, []);

  return (
    <Checkbox.Group
      className="w-full"
      value={value}
      onChange={(value) => {
        onChange?.(value);
      }}
    >
      <div className="w-full flex flex-col gap-2 p-2">
        {/* <Row
          gutter={16}
          className="py-4 px-2 rounded border border-solid border-gray-200"
        >
          <Col span={4} className=" font-bold">
            -
          </Col>
          <Col span={20}>
            <Checkbox value="*">全部权限</Checkbox>
          </Col>
        </Row> */}

        {permissionOptions.map((v, k) => {
          return (
            <Row
              key={k}
              gutter={16}
              className="py-1  px-1 rounded border border-solid border-gray-200"
            >
              <Col span={4} className="font-bold pl-0">
                {v.label}
              </Col>
              <Col span={20}>
                {v?.items?.map((vv, kk) => {
                  return (
                    <Checkbox
                      key={kk}
                      value={vv.value}
                      disabled={
                        vv.value !== "*" && value && value.includes("*")
                      }
                    >
                      {vv.label}
                    </Checkbox>
                  );
                })}
              </Col>
            </Row>
          );
        })}
      </div>
    </Checkbox.Group>
  );
};

export const RoleForm = ({ formProps }: { formProps: FormProps }) => {
  const t = useTranslate();

  return (
    <Form {...formProps} layout="vertical">
      <Form.Item
        label={t("role.fields.name")}
        name={["name"]}
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        // className="col-sm-12 px-3 py-2"
        name="permissions"
        label={t("role.fields.permissions")}
        rules={[{ required: true, message: "Please select permissions" }]}
      >
        <PermissionCheckbox />
      </Form.Item>
      <Form.Item label={t("fields.isActive.label")} name={["isActive"]}>
        <Switch />
      </Form.Item>
    </Form>
  );
};
