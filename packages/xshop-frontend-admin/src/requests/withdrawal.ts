import { Withdrawal, WithdrawalPagination } from "../generated/graphql";
import { request } from "../utils/request";
import {
  WITHDRAWALS_QUERY,
  COMPLETE_WITHDRAWAL_MUTATION,
} from "./withdrawal.graphql";

export const getWithdrawals = (variables: {
  where?: any;
  skip?: number;
  take?: number;
}) => {
  return request<{ withdrawals: WithdrawalPagination }>({
    query: WITHDRAWALS_QUERY,
    variables,
  });
};

export const completeWithdrawal = (variables: { id: string }) => {
  return request<{ completeWithdrawal: Withdrawal }>({
    query: COMPLETE_WITHDRAWAL_MUTATION,
    variables,
  });
};
