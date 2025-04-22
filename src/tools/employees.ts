import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const getEmployeesTool = {
  name: "workday_get_employees",
  description: "Get a list of employees from Workday.",
  inputSchema: {
    type: "object",
    properties: {
      offset: {
        type: "integer",
        format: "int64",
        description: "The zero-based index of the first object in a response collection. The default is 0. Use offset with the limit parameter to control paging of a response collection. Example: If limit is 5 and offset is 9, the response returns a collection of 5 objects starting with the 10th object.",
        default: 0
      },
      limit: {
        type: "integer",
        format: "int64",
        description: "The maximum number of objects in a single response. The default is 20. The maximum is 100.",
        default: 20,
        maximum: 100
      }
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
export const getEligibleLeaveBalanceTool = {
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

export const submitLeaveRequestTool = {
  name: "workday_submit_leave_request",
  description: "Submit a time off request for an employee in Workday.",
  inputSchema: {
      type: "object",
      properties: {
          worker_id: {
              type: "string",
              description: "The Workday worker ID of the employee (e.g., cc19e2bfeac21006b1600d7ade6a0000)"
          },
          days: {
              type: "array",
              description: "Array of leave request days",
              items: {
                  type: "object",
                  properties: {
                      start: {
                          type: "string",
                          description: "Start date and time of the leave (ISO format)",
                          pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}[.\\d{3}]*Z$"
                      },
                      date: {
                          type: "string",
                          description: "Date of the leave request (ISO format)",
                          pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}[.\\d{3}]*Z$"
                      },
                      end: {
                          type: "string",
                          description: "End date and time of the leave (ISO format)",
                          pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}[.\\d{3}]*Z$"
                      },
                      position: {
                          type: "object",
                          properties: {
                              descriptor: {
                                  type: "string",
                                  description: "Position description"
                              },
                              id: {
                                  type: "string",
                                  description: "Position ID"
                              }
                          },
                          required: ["id"]
                      },
                      reason: {
                          type: "object",
                          properties: {
                              id: {
                                  type: "string",
                                  description: "Reason ID for the leave request"
                              }
                          },
                          required: ["id"]
                      },
                      dailyQuantity: {
                          type: "string",
                          description: "The amount of leave requested for the day"
                      },
                      timeOffType: {
                          type: "object",
                          properties: {
                              descriptor: {
                                  type: "string",
                                  description: "Time off type description"
                              },
                              id: {
                                  type: "string",
                                  description: "Time off type ID"
                              }
                          },
                          required: ["id"]
                      },
                      comment: {
                          type: "string",
                          description: "Optional comment for the leave request"
                      },
                      descriptor: {
                          type: "string",
                          description: "Leave request description"
                      },
                      id: {
                          type: "string",
                          description: "Leave request ID"
                      }
                  },
                  required: ["date", "timeOffType"]
              }
          }
      },
      required: ["worker_id", "days"],
  },
};