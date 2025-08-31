import { DeleteButton, EditButton, List, useTable } from "@refinedev/antd";
import { useState } from "react";
import { useTranslate, type BaseRecord } from "@refinedev/core";
import {
  Space,
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Descriptions,
  QRCode,
} from "antd";
import { parse } from "graphql";
import {
  deleteMerchant,
  getMerchants,
  approveWechatMerchant,
  rejectWechatMerchant,
  completeWechatMerchant,
} from "../../requests/merchant";
import { Merchant, WechatMerchantStatus } from "../../generated/graphql";
import { request } from "../../utils/request";

export const MerchantList = () => {
  const t = useTranslate();
  const [form] = Form.useForm();
  const { tableProps, tableQueryResult } = useTable({
    meta: {
      gqlQuery: parse(getMerchants),
    },
  });

  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [completeModalVisible, setCompleteModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<BaseRecord | null>(null);
  const [loading, setLoading] = useState(false);

  const handleApprove = async (values: { wechatMerchantSignUrl: string }) => {
    if (!selectedRecord) return;
    setLoading(true);
    try {
      await request({
        query: approveWechatMerchant,
        variables: {
          data: {
            id: selectedRecord.id,
            wechatMerchantSignUrl: values.wechatMerchantSignUrl,
          },
        },
      });
      message.success("审核通过");
      setApproveModalVisible(false);
      tableQueryResult.refetch();
    } catch (error) {
      message.error("操作失败");
    }
    setLoading(false);
  };

  const handleReject = async (values: { wechatMerchantNote: string }) => {
    if (!selectedRecord) return;
    setLoading(true);
    try {
      await request({
        query: rejectWechatMerchant,
        variables: {
          data: {
            id: selectedRecord.id,
            wechatMerchantNote: values.wechatMerchantNote,
          },
        },
      });
      message.success("已拒绝");
      setRejectModalVisible(false);
      tableQueryResult.refetch();
    } catch (error) {
      message.error("操作失败");
    }
    setLoading(false);
  };

  const handleComplete = async (values: { wechatMerchantId: string }) => {
    if (!selectedRecord) return;
    setLoading(true);
    try {
      await request({
        query: completeWechatMerchant,
        variables: {
          data: {
            id: selectedRecord.id,
            wechatMerchantId: values.wechatMerchantId,
          },
        },
      });
      message.success("已完成");
      setCompleteModalVisible(false);
      tableQueryResult.refetch();
    } catch (error) {
      message.error("操作失败");
    }
    setLoading(false);
  };

  return (
    <List>
      <Modal
        title="通过微信支付申请"
        open={approveModalVisible}
        onCancel={() => setApproveModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleApprove}>
          <Form.Item
            name="wechatMerchantSignUrl"
            label="签约二维码"
            rules={[{ required: true, message: "请输入签约二维码链接" }]}
          >
            <Input placeholder="请输入签约二维码链接" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              确认
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="拒绝微信支付申请"
        open={rejectModalVisible}
        onCancel={() => setRejectModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleReject}>
          <Form.Item
            name="wechatMerchantNote"
            label="拒绝原因"
            rules={[{ required: true, message: "请输入拒绝原因" }]}
          >
            <Input.TextArea placeholder="请输入拒绝原因" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              确认
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="完成微信支付配置"
        open={completeModalVisible}
        onCancel={() => setCompleteModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleComplete}>
          <Form.Item
            name="wechatMerchantId"
            label="微信商户号"
            rules={[{ required: true, message: "请输入微信商户号" }]}
          >
            <Input placeholder="请输入微信商户号" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              确认
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title={"ID"} />
        <Table.Column
          dataIndex="logo"
          title={t("merchant.fields.logo")}
          render={(logo: string) => {
            return logo ? <img className="w-auto h-16" src={logo} /> : "-";
          }}
        />
        <Table.Column dataIndex="name" title={t("merchant.fields.name")} />
        <Table.Column dataIndex="phone" title={t("merchant.fields.phone")} />
        <Table.Column
          dataIndex="address"
          title={t("merchant.fields.address")}
        />
        <Table.Column
          dataIndex="wechatMerchantStatus"
          title="微信支付状态"
          render={(status: WechatMerchantStatus, record: BaseRecord) => {
            switch (status) {
              case WechatMerchantStatus.Created:
                return "待审核";
              case WechatMerchantStatus.Applied:
                return "已通过";
              case WechatMerchantStatus.Rejected:
                return "已拒绝";
              case WechatMerchantStatus.Completed:
                return "已完成";
              default:
                return "未申请";
            }
          }}
        />
        <Table.Column
          dataIndex="wechatMerchantId"
          title={t("merchant.fields.wechatMerchantId")}
        />
        <Table.Column
          dataIndex="wechatMerchantSignUrl"
          title={t("merchant.fields.wechatMerchantSignUrl")}
          render={(url: string) => {
            return url ? <QRCode value={url} size={100} /> : "-";
          }}
        />
        <Table.Column
          dataIndex="wechatMerchantNote"
          title={t("merchant.fields.wechatMerchantNote")}
        />
        <Table.Column
          dataIndex="idCardFrontPhoto"
          title={t("merchant.fields.idCardFrontPhoto")}
          render={(photo: string) => {
            return photo ? <img className="w-auto h-16" src={photo} /> : "-";
          }}
        />
        <Table.Column
          dataIndex="idCardBackPhoto"
          title={t("merchant.fields.idCardBackPhoto")}
          render={(photo: string) => {
            return photo ? <img className="w-auto h-16" src={photo} /> : "-";
          }}
        />
        <Table.Column
          dataIndex="businessLicensePhoto"
          title={t("merchant.fields.businessLicensePhoto")}
          render={(photo: string) => {
            return photo ? <img className="w-auto h-16" src={photo} /> : "-";
          }}
        />
        <Table.Column
          dataIndex="bankCardPhoto"
          title={t("merchant.fields.bankCardPhoto")}
          render={(photo: string) => {
            return photo ? <img className="w-auto h-16" src={photo} /> : "-";
          }}
        />
        <Table.Column
          title={t("table.actions")}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <DeleteButton
                hideText
                size="small"
                recordItemId={record.id}
                meta={{
                  gqlMutation: parse(deleteMerchant),
                }}
              />
              {record.wechatMerchantStatus === WechatMerchantStatus.Created && (
                <>
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => {
                      setSelectedRecord(record);
                      setApproveModalVisible(true);
                    }}
                  >
                    通过
                  </Button>
                  <Button
                    size="small"
                    danger
                    onClick={() => {
                      setSelectedRecord(record);
                      setRejectModalVisible(true);
                    }}
                  >
                    拒绝
                  </Button>
                </>
              )}
              {record.wechatMerchantStatus === WechatMerchantStatus.Applied && (
                <Button
                  size="small"
                  type="primary"
                  onClick={() => {
                    setSelectedRecord(record);
                    setCompleteModalVisible(true);
                  }}
                >
                  完成配置
                </Button>
              )}
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
