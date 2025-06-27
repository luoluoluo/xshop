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
} from "antd";
import { parse } from "graphql";
import { useState } from "react";
import {
  approveMerchantWithdrawal,
  completeMerchantWithdrawal,
  getMerchantWithdrawals,
  rejectMerchantWithdrawal,
} from "../../requests/merchant-withdrawal";
import { Merchant, MerchantWithdrawalStatus } from "../../generated/graphql";
import { request } from "../../utils/request";

const { TextArea } = Input;

export const MerchantWithdrawalList = () => {
  const { open } = useNotification();
  const t = useTranslate();
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [selectedMerchantWithdrawal, setSelectedMerchantWithdrawal] =
    useState<any>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [loading, setLoading] = useState(false);

  const { tableProps } = useTable({
    meta: {
      gqlQuery: parse(getMerchantWithdrawals),
    },
  });

  const handleApprove = (id: string) => {
    Modal.confirm({
      title: t("merchantWithdrawal.confirm.approve.title"),
      content: t("merchantWithdrawal.confirm.approve.content"),
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
              message: t("merchantWithdrawal.messages.approve.success"),
              type: "success",
            });
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
        reason: rejectReason,
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
          message: t("merchantWithdrawal.messages.reject.success"),
          type: "success",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleComplete = (id: string) => {
    Modal.confirm({
      title: t("merchantWithdrawal.confirm.complete.title"),
      content: t("merchantWithdrawal.confirm.complete.content"),
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
              message: t("merchantWithdrawal.messages.complete.success"),
              type: "success",
            });
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
        return t("merchantWithdrawal.status.created");
      case MerchantWithdrawalStatus.Approved:
        return t("merchantWithdrawal.status.approved");
      case MerchantWithdrawalStatus.Completed:
        return t("merchantWithdrawal.status.completed");
      case MerchantWithdrawalStatus.Rejected:
        return t("merchantWithdrawal.status.rejected");
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
              {t("merchantWithdrawal.actions.approve")}
            </Button>
            <Button
              danger
              size="small"
              onClick={() => handleReject(record)}
              loading={loading}
            >
              {t("merchantWithdrawal.actions.reject")}
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
            {t("merchantWithdrawal.actions.complete")}
          </Button>
        )}
      </Space>
    );
  };

  return (
    <>
      <List>
        <Table {...tableProps} rowKey="id">
          <Table.Column
            dataIndex="user"
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
              </div>
            )}
          />
          <Table.Column
            dataIndex="bankAccount"
            title={t("merchantWithdrawal.fields.bankAccount")}
            render={(account: string) => (
              <Tooltip title={account}>
                <span className="truncate max-w-32 block">
                  {account ? `****${account.slice(-4)}` : "-"}
                </span>
              </Tooltip>
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
            render={(date: string) => new Date(date).toLocaleString()}
          />
          <Table.Column
            dataIndex="approvedAt"
            title={t("merchantWithdrawal.fields.approvedAt")}
            render={(date: string) =>
              date ? new Date(date).toLocaleString() : "-"
            }
          />
          <Table.Column
            dataIndex="completedAt"
            title={t("merchantWithdrawal.fields.completedAt")}
            render={(date: string) =>
              date ? new Date(date).toLocaleString() : "-"
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
        title={t("merchantWithdrawal.modal.reject.title")}
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
          <p>{t("merchantWithdrawal.modal.reject.description")}：</p>
          <TextArea
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder={t("merchantWithdrawal.modal.reject.placeholder")}
          />
        </div>
      </Modal>
    </>
  );
};
