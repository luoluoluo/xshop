import { request } from "../utils/request.server";
import {
  WITHDRAWALS_QUERY,
  CREATE_WITHDRAWAL_MUTATION,
} from "./withdrawal.graphql";

export const getWithdrawals = (variables: {
  where?: any;
  skip?: number;
  take?: number;
}) => {
  return request({
    query: WITHDRAWALS_QUERY,
    variables,
  });
};

export const createWithdrawal = (variables: { data: any }) => {
  return request({
    query: CREATE_WITHDRAWAL_MUTATION,
    variables,
  });
};
