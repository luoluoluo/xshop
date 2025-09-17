import { Withdrawal, WithdrawalPagination } from "../generated/graphql";
import { request } from "../utils/request";
import {
  WITHDRAWALS_QUERY,
  CREATE_WITHDRAWAL_MUTATION,
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

export const createWithdrawal = (variables: { data: any }) => {
  return request<{ createWithdrawal: Withdrawal }>({
    query: CREATE_WITHDRAWAL_MUTATION,
    variables,
  });
};
