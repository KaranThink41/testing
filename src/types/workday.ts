export interface GetEmployeesArgs {
  offset?: number; // int64, zero-based index, default 0
  limit?: number;  // int64, default 20, max 100
}

export interface WorkdayApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
}

export interface TimeOffPosition {
  descriptor?: string;
  id: string;
}

export interface TimeOffReason {
  id: string;
}

export interface TimeOffType {
  descriptor?: string;
  id: string;
}

export interface LeaveRequestDay {
  start?: string;
  date: string;
  end?: string;
  position?: TimeOffPosition;
  reason?: TimeOffReason;
  dailyQuantity?: string;
  timeOffType: TimeOffType;
  comment?: string;
  descriptor?: string;
  id?: string;
}

export interface SubmitLeaveRequestArgs {
  worker_id: string;
  days: LeaveRequestDay[];
}
 