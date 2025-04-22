import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const getEmployeesTool: Tool = {
  name: "workday_get_employees",
  description: "Get a list of employees from Workday.",
  inputSchema: {
    type: "object",
    properties: {
      offset: { type: "number", description: "The zero-based index of the first object in a response collection (optional)", default: 0 },
      limit: { type: "number", description: "The maximum number of objects in a single response (optional)", default: 20 },
    },
    required: [],
  },
}; 

/**
 * Example curl for eligible absence types:
 * curl --request GET \
 *   --url 'https://wd2-impl-services1.workday.com/ccx/api/absenceManagement/v2/{tenant}/workers/{worker_id}/eligibleAbsenceTypes' \
 *   --header 'Authorization: Bearer {access_token}' \
 *   --header 'Content-Type: application/xml'
 */
export const getEligibleLeaveBalanceTool: Tool = {
  name: "workday_get_eligible_leave_balance",
  description: "Get the eligible absence types and leave balance for an employee from Workday.",
  inputSchema: {
    type: "object",
    properties: {
      worker_id: { 
        type: "string", 
        description: "The Workday worker ID of the employee (e.g., cc19e2bfeac21006b0b576e5d0840000)" 
      },
      limit: { 
        type: "number", 
        description: "Maximum number of absence types to return",
        default: 100
      }
    },
    required: ["worker_id"],
  },
}; 