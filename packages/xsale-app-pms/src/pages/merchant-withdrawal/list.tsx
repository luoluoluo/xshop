import { List, useTable } from "@refinedev/antd";
import { useGetIdentity, useTranslate } from "@refinedev/core";
import { Form, Radio, Table, Tag, Tooltip } from "antd";
import { parse } from "graphql";

import {
  Merchant,
  MerchantWithdrawalStatus,
  MerchantWithdrawalWhereInput,
} from "../../generated/graphql";
import { getMerchantWithdrawals } from "../../requests/merchant-withdrawal";
import dayjs from "dayjs";
import { useState } from "react";

export const MerchantWithdrawalList = () => {
  const t = useTranslate();
  const [where, setWhere] = useState<MerchantWithdrawalWhereInput>();

  const { tableProps } = useTable({
    meta: {
      gqlQuery: parse(getMerchantWithdrawals),
      variables: {
        where,
      },
    },
  });

  const { data: me } = useGetIdentity<Merchant>();

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
        return "待处理";
      case MerchantWithdrawalStatus.Approved:
        return "待打款";
      case MerchantWithdrawalStatus.Completed:
        return "已完成";
      case MerchantWithdrawalStatus.Rejected:
        return "已拒绝";
      default:
        return status;
    }
  };

  return (
    <>
      <List>
        <div className="text-xl font-bold mb-4">我的余额：¥{me?.balance}</div>
        <Form className="mt-4">
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
        </Table>
      </List>
    </>
  );
};
