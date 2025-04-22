export interface GetEmployeesArgs {
  offset?: number;
  limit?: number;
}

export interface GetEligibleLeaveBalanceArgs {
  worker_id: string;
  limit?: number;
}

export interface WorkdayApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
} 