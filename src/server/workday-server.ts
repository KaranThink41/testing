import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { WorkdayClient } from "../services/workday-client.js";
import { workdayConfig } from "../config/environment.js";
import { setupToolHandlers } from "./handlers.js";

export class WorkdayMcpServer {
  private server: Server;
  private workdayClient: WorkdayClient;

  constructor() {
    this.server = new Server(
      { name: "workday-mcp-server", version: "1.0.0" },
      { capabilities: { tools: {} } }
    );

    this.workdayClient = new WorkdayClient(
      workdayConfig.acessToken,
      workdayConfig.clientId,
      workdayConfig.clientSecret,
      workdayConfig.refreshToken
    );

    setupToolHandlers(this.server, this.workdayClient);
    this.setupErrorHandling();
  }

  private setupErrorHandling() {
    this.server.onerror = (error: any) => console.error("[MCP Error]", error);
    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Workday MCP server running on stdio");
  }
}