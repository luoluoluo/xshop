import { List, useTable } from "@refinedev/antd";
import { useGetIdentity, useTranslate } from "@refinedev/core";
import { Table, Tag, Tooltip } from "antd";
import { parse } from "graphql";

import { Affiliate, AffiliateWithdrawalStatus } from "../../generated/graphql";
import { getAffiliateWithdrawals } from "../../requests/affiliate-withdrawal";
import dayjs from "dayjs";

export const AffiliateWithdrawalList = () => {
  const t = useTranslate();

  const { tableProps } = useTable({
    meta: {
      gqlQuery: parse(getAffiliateWithdrawals),
    },
  });

  const { data: me } = useGetIdentity<Affiliate>();

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
        return "待处理";
      case AffiliateWithdrawalStatus.Approved:
        return "已通过";
      case AffiliateWithdrawalStatus.Completed:
        return "已完成";
      case AffiliateWithdrawalStatus.Rejected:
        return "已拒绝";
      default:
        return status;
    }
  };

  return (
    <>
      <div className="text-2xl font-bold mb-4">我的余额：¥{me?.balance}</div>
      <List>
        <Table {...tableProps} rowKey="id">
          <Table.Column
            dataIndex="id"
            title={t("affiliateWithdrawal.fields.id")}
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
        </Table>
      </List>
    </>
  );
};
