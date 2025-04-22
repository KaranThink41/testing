import { CallToolRequest, ErrorCode, McpError, ListToolsRequestSchema,CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { GetEmployeesArgs, GetEligibleLeaveBalanceArgs } from "../types/workday.js";
import { WorkdayClient } from "../services/workday-client.js";
import { getEmployeesTool, getEligibleLeaveBalanceTool } from "../tools/employees.js";

export function setupToolHandlers(server: any, workdayClient: WorkdayClient) {
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [getEmployeesTool, getEligibleLeaveBalanceTool],
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
    try {
      if (!request.params.arguments) {
        throw new McpError(ErrorCode.InvalidParams, "No arguments provided");
      }

      switch (request.params.name) {
        case "workday_get_employees":
          return await handleGetEmployees(workdayClient, request.params.arguments as GetEmployeesArgs);
        case "workday_get_eligible_leave_balance":
          return await handleGetEligibleLeaveBalance(workdayClient, request.params.arguments as unknown as GetEligibleLeaveBalanceArgs);
        default:
          throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
      }
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  });
}

function missingConfig() {
  return !process.env.WORKDAY_CLIENT_ID ||
    !process.env.WORKDAY_CLIENT_SECRET ||
    !process.env.WORKDAY_TENANT ||
    !process.env.WORKDAY_REFRESH_TOKEN;
}

async function handleGetEmployees(workdayClient: WorkdayClient, args: GetEmployeesArgs) {
  if (missingConfig()) {
    return {
      content: [{ type: "text", text: "Workday configuration is missing. Please set WORKDAY_CLIENT_ID, WORKDAY_CLIENT_SECRET, WORKDAY_TENANT, and WORKDAY_REFRESH_TOKEN." }],
      isError: true,
    };
  }
  try {
    const response = await workdayClient.getEmployees(args.offset, args.limit);
    return { content: [{ type: "text", text: JSON.stringify(response) }] };
  } catch (error: any) {
    return {
      content: [{ type: "text", text: `Error: ${error.message}` }],
      isError: true,
    };
  }
}

async function handleGetEligibleLeaveBalance(workdayClient: WorkdayClient, args: GetEligibleLeaveBalanceArgs) {
  if (missingConfig()) {
    return {
      content: [{ type: "text", text: "Workday configuration is missing. Please set WORKDAY_CLIENT_ID, WORKDAY_CLIENT_SECRET, WORKDAY_TENANT, and WORKDAY_REFRESH_TOKEN." }],
      isError: true,
    };
  }
  try {
    const response = await workdayClient.getEligibleAbsenceTypes(args.worker_id, args.limit);
    return { content: [{ type: "text", text: JSON.stringify(response) }] };
  } catch (error: any) {
    return {
      content: [{ type: "text", text: `Error: ${error.message}` }],
      isError: true,
    };
  }
}