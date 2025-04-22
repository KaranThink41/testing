import { CallToolRequest, ErrorCode, McpError, ListToolsRequestSchema,CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { GetEmployeesArgs, SubmitLeaveRequestArgs } from "../types/workday.js";
import { WorkdayClient } from "../services/workday-client.js";
import {
  getEmployeesTool,
  getEligibleLeaveBalanceTool,
  submitLeaveRequestTool,
} from "../tools/employees.js";

function missingConfig() {
  return !process.env.WORKDAY_CLIENT_ID ||
    !process.env.WORKDAY_CLIENT_SECRET ||
    !process.env.WORKDAY_TENANT ||
    !process.env.WORKDAY_REFRESH_TOKEN;
}

export function setupToolHandlers(server: any, workdayClient: WorkdayClient) {
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      getEmployeesTool,
      getEligibleLeaveBalanceTool,
      submitLeaveRequestTool,
    ],
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
          // If you need to support getEligibleLeaveBalance, implement handler here.
          throw new McpError(ErrorCode.MethodNotFound, "Not implemented: workday_get_eligible_leave_balance");
        case "workday_submit_leave_request":
          return await handleSubmitLeaveRequest(workdayClient, request.params.arguments as unknown as SubmitLeaveRequestArgs);
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

async function handleSubmitLeaveRequest(
  workdayClient: WorkdayClient,
  args: SubmitLeaveRequestArgs
) {
  if (missingConfig()) {
    return {
      content: [{ type: "text", text: "Workday configuration is missing. Please set WORKDAY_CLIENT_ID, WORKDAY_CLIENT_SECRET, WORKDAY_TENANT, and WORKDAY_REFRESH_TOKEN." }],
      isError: true,
    };
  }
  try {
    const response = await workdayClient.submitLeaveRequest(
      args.worker_id,
      args.days
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response),
        },
      ],
    };
  } catch (error: unknown) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        },
      ],
      isError: true,
    };
  }
}