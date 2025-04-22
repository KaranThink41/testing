import { CallToolRequest, ErrorCode, McpError, ListToolsRequestSchema,CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { GetEmployeesArgs, GetEligibleLeaveBalanceArgs } from "../types/workday.js";
import { WorkdayClient } from "../services/workday-client.js";
import { getEmployeesTool, getEligibleLeaveBalanceTool } from "../tools/employees.js";

export function setupToolHandlers(server: any, workdayClient: WorkdayClient) {
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    const requiredVars = [
      process.env.WORKDAY_CLIENT_ID,
      process.env.WORKDAY_CLIENT_SECRET,
      process.env.WORKDAY_TENANT,
      process.env.WORKDAY_REFRESH_TOKEN
    ];
    const hasConfig = requiredVars.every(Boolean);

    if (!hasConfig) {
      return {
        tools: [
          {
            name: "configure_workday",
            description: "Please configure Workday credentials to enable tools.",
            inputSchema: {
              type: "object",
              properties: {},
            },
          },
        ],
      };
    }
    return {
      tools: [getEmployeesTool, getEligibleLeaveBalanceTool],
    };
  });

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

async function handleGetEmployees(workdayClient: WorkdayClient, args: GetEmployeesArgs) {
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