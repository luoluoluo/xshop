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
  approveAffiliateWithdrawal,
  completeAffiliateWithdrawal,
  getAffiliateWithdrawals,
  rejectAffiliateWithdrawal,
} from "../../requests/affiliate-withdrawal";
import {
  Affiliate,
  AffiliateWithdrawalStatus,
  AffiliateWithdrawalWhereInput,
} from "../../generated/graphql";
import { request } from "../../utils/request";
import dayjs from "dayjs";

const { TextArea } = Input;

export const AffiliateWithdrawalList = () => {
  const { open } = useNotification();
  const t = useTranslate();
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [selectedAffiliateWithdrawal, setSelectedAffiliateWithdrawal] =
    useState<any>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [where, setWhere] = useState<AffiliateWithdrawalWhereInput>();

  const { tableProps, tableQuery } = useTable({
    meta: {
      gqlQuery: parse(getAffiliateWithdrawals),
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
        return "待审核";
      case AffiliateWithdrawalStatus.Approved:
        return "待打款";
      case AffiliateWithdrawalStatus.Completed:
        return "已打款";
      case AffiliateWithdrawalStatus.Rejected:
        return "已拒绝";
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
        {status === AffiliateWithdrawalStatus.Approved && (
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
                  label: getStatusText(AffiliateWithdrawalStatus.Created),
                  value: AffiliateWithdrawalStatus.Created,
                },
                {
                  label: getStatusText(AffiliateWithdrawalStatus.Approved),
                  value: AffiliateWithdrawalStatus.Approved,
                },
                {
                  label: getStatusText(AffiliateWithdrawalStatus.Completed),
                  value: AffiliateWithdrawalStatus.Completed,
                },
                {
                  label: getStatusText(AffiliateWithdrawalStatus.Rejected),
                  value: AffiliateWithdrawalStatus.Rejected,
                },
              ]}
              onChange={(e) => {
                setWhere({
                  ...where,
                  status: e.target.value as AffiliateWithdrawalStatus,
                });
              }}
            />
          </Form.Item>
        </Form>
        <Table {...tableProps} rowKey="id" className="mt-4">
          <Table.Column
            dataIndex="id"
            title={t("affiliateWithdrawal.fields.id")}
            width={120}
          />
          <Table.Column
            dataIndex="affiliate"
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
                <div className="text-sm text-gray-500">
                  {record.bankAccount || "-"}
                </div>
              </div>
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
            render={(date: string) => dayjs(date).format("YYYY-MM-DD HH:mm:ss")}
          />
          <Table.Column
            dataIndex="approvedAt"
            title={t("affiliateWithdrawal.fields.approvedAt")}
            render={(date: string) =>
              date ? dayjs(date).format("YYYY-MM-DD HH:mm:ss") : "-"
            }
          />
          <Table.Column
            dataIndex="completedAt"
            title={t("affiliateWithdrawal.fields.completedAt")}
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
          setSelectedAffiliateWithdrawal(null);
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
