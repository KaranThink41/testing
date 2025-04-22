import { WorkdayApiResponse } from "../types/workday.js";
import dotenv from "dotenv";
dotenv.config();

export class WorkdayClient {
  private accessToken: string;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly refreshToken: string;

  constructor(accessToken: string, clientId: string, clientSecret: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.refreshToken = refreshToken;
  }

  private async makeApiRequest<T>(url: string, method: string = "GET", body: any = null): Promise<WorkdayApiResponse<T>> {
    const accessToken = this.accessToken;
    const headers: Record<string, string> = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };

    console.info("headers" + headers);

    const config: RequestInit = {
      method,
      headers,
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      console.error(`API request failed for ${url} with status ${response.status}:`, data);
      throw new Error(data.error || data.message || `API request failed with status ${response.status}`);
    }

    return data;
  }

  async getEmployees(offset: number = 0, limit: number = 20): Promise<WorkdayApiResponse<any>> {
    const params = new URLSearchParams({
      offset: offset.toString(),
      limit: Math.min(limit, 100).toString(),
    });
    const tenant = process.env.WORKDAY_TENANT;
    const employeesUrl = `https://wd2-impl-services1.workday.com/ccx/api/staffing/v6/${tenant}/workers/?${params.toString()}`;
    return await this.makeApiRequest(employeesUrl);
  }

  async getEligibleAbsenceTypes(worker_id: string, limit?: number): Promise<WorkdayApiResponse<any>> {
    const tenant = process.env.WORKDAY_TENANT;
    let url = `https://wd2-impl-services1.workday.com/ccx/api/absenceManagement/v2/${tenant}/workers/${worker_id}/eligibleAbsenceTypes`;
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if ([...params].length > 0) url += `?${params.toString()}`;
    return await this.makeApiRequest(url);
  }
}