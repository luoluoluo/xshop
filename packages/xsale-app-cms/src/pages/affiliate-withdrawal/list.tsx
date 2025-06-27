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
  approveAffiliateWithdrawal,
  completeAffiliateWithdrawal,
  getAffiliateWithdrawals,
  rejectAffiliateWithdrawal,
} from "../../requests/affiliate-withdrawal";
import { Affiliate, AffiliateWithdrawalStatus } from "../../generated/graphql";
import { request } from "../../utils/request";

const { TextArea } = Input;

export const AffiliateWithdrawalList = () => {
  const { open } = useNotification();
  const t = useTranslate();
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [selectedAffiliateWithdrawal, setSelectedAffiliateWithdrawal] =
    useState<any>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [loading, setLoading] = useState(false);

  const { tableProps } = useTable({
    meta: {
      gqlQuery: parse(getAffiliateWithdrawals),
    },
  });

  const handleApprove = (id: string) => {
    Modal.confirm({
      title: t("affiliateWithdrawal.confirm.approve.title"),
      content: t("affiliateWithdrawal.confirm.approve.content"),
      onOk: () => {
        setLoading(true);
        request({
          query: approveAffiliateWithdrawal,
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
              message: t("affiliateWithdrawal.messages.approve.success"),
              type: "success",
            });
          })
          .finally(() => {
            setLoading(false);
          });
      },
    });
  };

  const handleReject = (affiliateWithdrawal: any) => {
    setSelectedAffiliateWithdrawal(affiliateWithdrawal);
    setRejectModalVisible(true);
  };

  const handleRejectConfirm = () => {
    if (!rejectReason.trim()) {
      message.error(t("affiliateWithdrawal.messages.reject.reasonRequired"));
      return;
    }
    setLoading(true);
    request({
      query: rejectAffiliateWithdrawal,
      variables: {
        id: selectedAffiliateWithdrawal.id,
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
          message: t("affiliateWithdrawal.messages.reject.success"),
          type: "success",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleComplete = (id: string) => {
    Modal.confirm({
      title: t("affiliateWithdrawal.confirm.complete.title"),
      content: t("affiliateWithdrawal.confirm.complete.content"),
      onOk: () => {
        setLoading(true);
        request({
          query: completeAffiliateWithdrawal,
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
              message: t("affiliateWithdrawal.messages.complete.success"),
              type: "success",
            });
          })
          .finally(() => {
            setLoading(false);
          });
      },
    });
  };

  const getStatusColor = (status: AffiliateWithdrawalStatus) => {
    switch (status) {
      case AffiliateWithdrawalStatus.Created:
        return "processing";
      case AffiliateWithdrawalStatus.Approved:
        return "warning";
      case AffiliateWithdrawalStatus.Completed:
        return "success";
      case AffiliateWithdrawalStatus.Rejected:
        return "error";
      default:
        return "default";
    }
  };

  const getStatusText = (status: AffiliateWithdrawalStatus) => {
    switch (status) {
      case AffiliateWithdrawalStatus.Created:
        return t("affiliateWithdrawal.status.created");
      case AffiliateWithdrawalStatus.Approved:
        return t("affiliateWithdrawal.status.approved");
      case AffiliateWithdrawalStatus.Completed:
        return t("affiliateWithdrawal.status.completed");
      case AffiliateWithdrawalStatus.Rejected:
        return t("affiliateWithdrawal.status.rejected");
      default:
        return status;
    }
  };

  const renderActions = (record: any) => {
    const { status, id } = record;

    return (
      <Space>
        {status === AffiliateWithdrawalStatus.Created && (
          <>
            <Button
              type="primary"
              size="small"
              onClick={() => handleApprove(id)}
              loading={loading}
            >
              {t("affiliateWithdrawal.actions.approve")}
            </Button>
            <Button
              danger
              size="small"
              onClick={() => handleReject(record)}
              loading={loading}
            >
              {t("affiliateWithdrawal.actions.reject")}
            </Button>
          </>
        )}
        {status === AffiliateWithdrawalStatus.Approved && (
          <Button
            type="primary"
            size="small"
            onClick={() => handleComplete(id)}
            loading={loading}
          >
            {t("affiliateWithdrawal.actions.complete")}
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
            title={t("affiliateWithdrawal.fields.affiliate")}
            render={(affiliate: Affiliate) => {
              return (
                <div>
                  <div className="font-medium">{affiliate?.name || "-"}</div>
                  <div className="text-sm text-gray-500">
                    {affiliate?.phone || "-"}
                  </div>
                </div>
              );
            }}
          />

          <Table.Column
            dataIndex="amount"
            title={t("affiliateWithdrawal.fields.amount")}
            render={(amount: number) => `¥${amount?.toFixed(2) || "0.00"}`}
          />
          <Table.Column
            dataIndex="bankName"
            title={t("affiliateWithdrawal.fields.bank")}
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
            title={t("affiliateWithdrawal.fields.bankAccount")}
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
            title={t("affiliateWithdrawal.fields.status")}
            render={(status: AffiliateWithdrawalStatus) => (
              <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
            )}
          />
          <Table.Column
            dataIndex="note"
            title={t("affiliateWithdrawal.fields.note")}
            render={(note: string) => (
              <Tooltip title={note}>
                <span className="truncate max-w-20 block">{note || "-"}</span>
              </Tooltip>
            )}
          />
          <Table.Column
            dataIndex="createdAt"
            title={t("affiliateWithdrawal.fields.createdAt")}
            render={(date: string) => new Date(date).toLocaleString()}
          />
          <Table.Column
            dataIndex="approvedAt"
            title={t("affiliateWithdrawal.fields.approvedAt")}
            render={(date: string) =>
              date ? new Date(date).toLocaleString() : "-"
            }
          />
          <Table.Column
            dataIndex="completedAt"
            title={t("affiliateWithdrawal.fields.completedAt")}
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
        title={t("affiliateWithdrawal.modal.reject.title")}
        open={rejectModalVisible}
        onOk={handleRejectConfirm}
        onCancel={() => {
          setRejectModalVisible(false);
          setRejectReason("");
          setSelectedAffiliateWithdrawal(null);
        }}
        confirmLoading={loading}
      >
        <div className="mb-4">
          <p>{t("affiliateWithdrawal.modal.reject.description")}：</p>
          <TextArea
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder={t("affiliateWithdrawal.modal.reject.placeholder")}
          />
        </div>
      </Modal>
    </>
  );
};
