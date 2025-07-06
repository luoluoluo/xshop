import { List, useTable } from "@refinedev/antd";
import { useGetIdentity, useTranslate } from "@refinedev/core";
import { Form, Radio, Table, Tag, Tooltip } from "antd";
import { parse } from "graphql";

import {
  Affiliate,
  AffiliateWithdrawalStatus,
  AffiliateWithdrawalWhereInput,
} from "../../generated/graphql";
import { getAffiliateWithdrawals } from "../../requests/affiliate-withdrawal";
import dayjs from "dayjs";
import { useState } from "react";

export const AffiliateWithdrawalList = () => {
  const t = useTranslate();
  const [where, setWhere] = useState<AffiliateWithdrawalWhereInput>();

  const { tableProps } = useTable({
    meta: {
      gqlQuery: parse(getAffiliateWithdrawals),
      variables: {
        where,
      },
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

  return (
    <>
      <List>
        <div className="text-xl font-bold mb-4">我的余额：¥{me?.balance}</div>
        <Form layout="inline" className="mt-4">
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
