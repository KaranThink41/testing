#!/usr/bin/env node
import { WorkdayMcpServer } from "./server/workday-server.js";

const server = new WorkdayMcpServer();
server.run().catch(console.error);

