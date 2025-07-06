import { List, useTable } from "@refinedev/antd";
import { useNotification, useTranslate } from "@refinedev/core";
import {
  Space,
  Table,
  Tag,
  Tooltip,
  Button,
  Modal,
  Input,
  message,
  Form,
  Radio,
} from "antd";
import { parse } from "graphql";
import { useState } from "react";
import {
  approveMerchantWithdrawal,
  completeMerchantWithdrawal,
  getMerchantWithdrawals,
  rejectMerchantWithdrawal,
} from "../../requests/merchant-withdrawal";
import {
  Merchant,
  MerchantWithdrawalStatus,
  MerchantWithdrawalWhereInput,
} from "../../generated/graphql";
import { request } from "../../utils/request";
import dayjs from "dayjs";

const { TextArea } = Input;

export const MerchantWithdrawalList = () => {
  const { open } = useNotification();
  const t = useTranslate();
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [selectedMerchantWithdrawal, setSelectedMerchantWithdrawal] =
    useState<any>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [where, setWhere] = useState<MerchantWithdrawalWhereInput>();

  const { tableProps, tableQuery } = useTable({
    meta: {
      gqlQuery: parse(getMerchantWithdrawals),
      variables: {
        where,
      },
    },
  });

  const handleApprove = (id: string) => {
    Modal.confirm({
      title: "审批通过",
      content: "确定要审批通过吗？",
      onOk: () => {
        setLoading(true);
        request({
          query: approveMerchantWithdrawal,
          variables: {
            id,
          },
        })
          .then((res) => {
            if (res.errors) {
              open?.({
                message: res.errors[0].message,
                type: "error",
              });
              return;
            }
            open?.({
              message: "审批通过成功",
              type: "success",
            });
            tableQuery?.refetch();
          })
          .finally(() => {
            setLoading(false);
          });
      },
    });
  };

  const handleReject = (merchantWithdrawal: any) => {
    setSelectedMerchantWithdrawal(merchantWithdrawal);
    setRejectModalVisible(true);
  };

  const handleRejectConfirm = () => {
    if (!rejectReason.trim()) {
      message.error(t("merchantWithdrawal.messages.reject.reasonRequired"));
      return;
    }
    setLoading(true);
    request({
      query: rejectMerchantWithdrawal,
      variables: {
        id: selectedMerchantWithdrawal.id,
        rejectReason,
      },
    })
      .then((res) => {
        if (res.errors) {
          open?.({
            message: res.errors[0].message,
            type: "error",
          });
          return;
        }
        open?.({
          message: "审批拒绝成功",
          type: "success",
        });
        setRejectModalVisible(false);
        setRejectReason("");
        tableQuery?.refetch();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleComplete = (id: string) => {
    Modal.confirm({
      title: "打款完成",
      content: "确定要打款完成吗？",
      onOk: () => {
        setLoading(true);
        request({
          query: completeMerchantWithdrawal,
          variables: {
            id,
          },
        })
          .then((res) => {
            if (res.errors) {
              open?.({
                message: res.errors[0].message,
                type: "error",
              });
              return;
            }
            open?.({
              message: "打款完成成功",
              type: "success",
            });
            tableQuery?.refetch();
          })
          .finally(() => {
            setLoading(false);
          });
      },
    });
  };

  const getStatusColor = (status: MerchantWithdrawalStatus) => {
    switch (status) {
      case MerchantWithdrawalStatus.Created:
        return "processing";
      case MerchantWithdrawalStatus.Approved:
        return "warning";
      case MerchantWithdrawalStatus.Completed:
        return "success";
      case MerchantWithdrawalStatus.Rejected:
        return "error";
      default:
        return "default";
    }
  };

  const getStatusText = (status: MerchantWithdrawalStatus) => {
    switch (status) {
      case MerchantWithdrawalStatus.Created:
        return "待审核";
      case MerchantWithdrawalStatus.Approved:
        return "待打款";
      case MerchantWithdrawalStatus.Completed:
        return "已打款";
      case MerchantWithdrawalStatus.Rejected:
        return "已拒绝";
      default:
        return status;
    }
  };

  const renderActions = (record: any) => {
    const { status, id } = record;

    return (
      <Space>
        {status === MerchantWithdrawalStatus.Created && (
          <>
            <Button
              type="primary"
              size="small"
              onClick={() => handleApprove(id)}
              loading={loading}
            >
              审批通过
            </Button>
            <Button
              danger
              size="small"
              onClick={() => handleReject(record)}
              loading={loading}
            >
              审批拒绝
            </Button>
          </>
        )}
        {status === MerchantWithdrawalStatus.Approved && (
          <Button
            type="primary"
            size="small"
            onClick={() => handleComplete(id)}
            loading={loading}
          >
            打款完成
          </Button>
        )}
      </Space>
    );
  };

  return (
    <>
      <List>
        <Form layout="inline">
          <Form.Item name="status" label="状态">
            <Radio.Group
              optionType="button"
              options={[
                {
                  label: "全部",
                  value: undefined,
                },
                {
                  label: getStatusText(MerchantWithdrawalStatus.Created),
                  value: MerchantWithdrawalStatus.Created,
                },
                {
                  label: getStatusText(MerchantWithdrawalStatus.Approved),
                  value: MerchantWithdrawalStatus.Approved,
                },
                {
                  label: getStatusText(MerchantWithdrawalStatus.Completed),
                  value: MerchantWithdrawalStatus.Completed,
                },
                {
                  label: getStatusText(MerchantWithdrawalStatus.Rejected),
                  value: MerchantWithdrawalStatus.Rejected,
                },
              ]}
              onChange={(e) => {
                setWhere({
                  ...where,
                  status: e.target.value as MerchantWithdrawalStatus,
                });
              }}
            />
          </Form.Item>
        </Form>
        <Table {...tableProps} rowKey="id" className="mt-4">
          <Table.Column
            dataIndex="id"
            title={t("merchantWithdrawal.fields.id")}
            width={120}
          />
          <Table.Column
            dataIndex="merchant"
            title={t("merchantWithdrawal.fields.merchant")}
            render={(merchant: Merchant) => {
              return (
                <div>
                  <div className="font-medium">{merchant?.name || "-"}</div>
                  <div className="text-sm text-gray-500">
                    {merchant?.phone || "-"}
                  </div>
                </div>
              );
            }}
          />

          <Table.Column
            dataIndex="amount"
            title={t("merchantWithdrawal.fields.amount")}
            render={(amount: number) => `¥${amount?.toFixed(2) || "0.00"}`}
          />
          <Table.Column
            dataIndex="bankName"
            title={t("merchantWithdrawal.fields.bank")}
            render={(bankName: string, record: any) => (
              <div>
                <div className="font-medium">{bankName || "-"}</div>
                <div className="text-sm text-gray-500">
                  {record.accountName || "-"}
                </div>
                <div className="text-sm text-gray-500">
                  {record.bankAccount || "-"}
                </div>
              </div>
            )}
          />
          <Table.Column
            dataIndex="status"
            title={t("merchantWithdrawal.fields.status")}
            render={(status: MerchantWithdrawalStatus) => (
              <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
            )}
          />
          <Table.Column
            dataIndex="note"
            title={t("merchantWithdrawal.fields.note")}
            render={(note: string) => (
              <Tooltip title={note}>
                <span className="truncate max-w-20 block">{note || "-"}</span>
              </Tooltip>
            )}
          />
          <Table.Column
            dataIndex="createdAt"
            title={t("merchantWithdrawal.fields.createdAt")}
            render={(date: string) => dayjs(date).format("YYYY-MM-DD HH:mm:ss")}
          />
          <Table.Column
            dataIndex="approvedAt"
            title={t("merchantWithdrawal.fields.approvedAt")}
            render={(date: string) =>
              date ? dayjs(date).format("YYYY-MM-DD HH:mm:ss") : "-"
            }
          />
          <Table.Column
            dataIndex="completedAt"
            title={t("merchantWithdrawal.fields.completedAt")}
            render={(date: string) =>
              date ? dayjs(date).format("YYYY-MM-DD HH:mm:ss") : "-"
            }
          />
          <Table.Column
            title={t("table.actions")}
            render={(_, record: any) => renderActions(record)}
            width={150}
          />
        </Table>
      </List>

      <Modal
        title="审批拒绝"
        open={rejectModalVisible}
        onOk={handleRejectConfirm}
        onCancel={() => {
          setRejectModalVisible(false);
          setRejectReason("");
          setSelectedMerchantWithdrawal(null);
        }}
        confirmLoading={loading}
      >
        <div className="mb-4">
          <p>请输入拒绝原因：</p>
          <TextArea
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="请输入拒绝原因"
          />
        </div>
      </Modal>
    </>
  );
};
