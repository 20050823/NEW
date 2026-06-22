#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const os = require("os");

const serverInfo = { name: "memory", version: "0.1.1" };
let buffer = Buffer.alloc(0);

const zh = {
  recap: "\u672c\u6b21\u590d\u76d8\u7ed3\u8bba",
  recommendedScope: "\u5efa\u8bae\u5199\u5165\u8303\u56f4",
  globalContent: "\u5168\u5c40\u8bb0\u5fc6\u62df\u5199\u5165\u5185\u5bb9",
  projectContent: "\u5f53\u524d\u9879\u76ee\u8bb0\u5fc6\u62df\u5199\u5165\u5185\u5bb9",
  excluded: "\u4e0d\u5efa\u8bae\u5199\u5165\u957f\u671f\u8bb0\u5fc6\u7684\u5185\u5bb9",
  choose: "\u8bf7\u9009\u62e9\u5199\u5165\u8303\u56f4",
  fallbackRecap: "\u8bf7\u57fa\u4e8e\u5f53\u524d\u53ef\u89c1\u5bf9\u8bdd\u6574\u7406\u9700\u8981\u6c89\u6dc0\u7684\u534f\u4f5c\u89c4\u5219\u3001\u9879\u76ee\u4e8b\u5b9e\u548c\u6539\u8fdb\u9879\u3002",
  fallbackGlobal: "- \u6682\u672a\u63d0\u4f9b\u5168\u5c40\u89c4\u5219\u3002\u8bf7\u53ea\u653e\u957f\u671f\u3001\u8de8\u9879\u76ee\u90fd\u9002\u7528\u7684\u534f\u4f5c\u504f\u597d\u3002",
  fallbackProject: "- \u6682\u672a\u63d0\u4f9b\u9879\u76ee\u89c4\u5219\u3002\u8bf7\u653e\u5f53\u524d\u9879\u76ee\u8def\u5f84\u3001\u7ea6\u5b9a\u3001\u9636\u6bb5\u6027\u7ed3\u8bba\u548c\u53ea\u5bf9\u672c\u9879\u76ee\u6709\u6548\u7684\u4e0a\u4e0b\u6587\u3002",
  fallbackExcluded: "- \u4e00\u6b21\u6027\u8fc7\u7a0b\u7ec6\u8282\u3001\u4e34\u65f6\u5931\u8d25\u5c1d\u8bd5\u3001\u4e0d\u53ef\u590d\u7528\u7684\u4e2d\u95f4\u8f93\u51fa\u3002",
  option1: "1. \u5f53\u524d\u9879\u76ee\u8bb0\u5fc6",
  option2: "2. \u5168\u5c40\u8bb0\u5fc6",
  option3: "3. \u4e24\u8005\u90fd\u5199",
  option4: "4. \u4e0d\u5199\u5165\uff0c\u53ea\u4fdd\u7559\u672c\u6b21\u603b\u7ed3",
  noWrite: "\u6ca1\u6709\u5199\u5165\u65b0\u5185\u5bb9\uff1a\u8bf7\u68c0\u67e5 scope \u548c\u5185\u5bb9\uff0c\u6216\u8005\u76ee\u6807\u6587\u4ef6\u5df2\u5305\u542b\u76f8\u540c\u5185\u5bb9\u3002",
  notConfirmed: "\u672a\u5199\u5165\uff1a\u5fc5\u987b\u5148\u5411\u7528\u6237\u5c55\u793a\u62df\u5199\u5165\u5185\u5bb9\uff0c\u5e76\u5728\u7528\u6237\u660e\u786e\u9009\u62e9 1/2/3 \u540e\u4f20\u5165 confirmed: true\u3002",
  wrote: "\u5df2\u5199\u5165\uff1a"
};

function send(payload) {
  const body = Buffer.from(JSON.stringify(payload), "utf8");
  process.stdout.write(`Content-Length: ${body.length}\r\n\r\n`);
  process.stdout.write(body);
}

function result(id, value) {
  send({ jsonrpc: "2.0", id, result: value });
}

function rpcError(id, code, message) {
  send({ jsonrpc: "2.0", id, error: { code, message } });
}

function text(content) {
  return { content: [{ type: "text", text: content }] };
}

function normalizeRoot(input) {
  if (typeof input === "string" && input.trim()) return path.resolve(input);
  return process.env.CODEX_WORKSPACE_ROOT || process.env.PWD || process.cwd();
}

function globalPath() {
  return path.join(os.homedir(), "Documents", "Codex", "AGENTS.md");
}

function appendSection(filePath, heading, markdown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const existing = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8").trimEnd() : "";
  const content = String(markdown).trim();
  if (!content) return false;
  const section = `\n\n## ${heading}\n\n${content}\n`;
  if (existing.includes(content)) return false;
  if (!existing) fs.writeFileSync(filePath, `# Agent Collaboration Preferences${section}`, "utf8");
  else fs.writeFileSync(filePath, existing + section, "utf8");
  return true;
}

function reviewMemoryPlan(args = {}) {
  const conversation = String(args.conversationSummary || "").trim();
  const project = String(args.projectContext || "").trim();
  const globalContent = String(args.proposedGlobalMemory || "").trim();
  const projectContent = String(args.proposedProjectMemory || "").trim();
  const excluded = String(args.excludedFromLongTerm || "").trim();
  const recommendation = String(args.recommendedScope || "3").trim();

  return `**${zh.recap}**\n${conversation || zh.fallbackRecap}\n\n` +
    `**${zh.recommendedScope}**\n${recommendation}\n\n` +
    `**${zh.globalContent}**\n${globalContent || zh.fallbackGlobal}\n\n` +
    `**${zh.projectContent}**\n${projectContent || project || zh.fallbackProject}\n\n` +
    `**${zh.excluded}**\n${excluded || zh.fallbackExcluded}\n\n` +
    `**${zh.choose}**\n${zh.option1}\n${zh.option2}\n${zh.option3}\n${zh.option4}`;
}

function writeMemoryFiles(args = {}) {
  const scope = String(args.scope || "").trim().toLowerCase();
  const confirmed = args.confirmed === true || args.confirmed === "true";
  const workspaceRoot = normalizeRoot(args.workspaceRoot);
  const heading = String(args.heading || "Memory Update").trim();
  const globalContent = String(args.globalContent || "").trim();
  const projectContent = String(args.projectContent || "").trim();
  const changed = [];

  if (!confirmed) return zh.notConfirmed;

  if ((scope === "2" || scope === "3" || scope === "global" || scope === "both") && globalContent) {
    const target = globalPath();
    if (appendSection(target, heading, globalContent)) changed.push(target);
  }

  if ((scope === "1" || scope === "3" || scope === "project" || scope === "both") && projectContent) {
    const agents = path.join(workspaceRoot, "AGENTS.md");
    const claude = path.join(workspaceRoot, "CLAUDE.md");
    if (appendSection(agents, heading, projectContent)) changed.push(agents);
    if (appendSection(claude, heading, projectContent)) changed.push(claude);
  }

  if (!changed.length) return zh.noWrite;
  return `${zh.wrote}\n${changed.map((p) => `- ${p}`).join("\n")}`;
}

const tools = [
  {
    name: "review_memory_plan",
    description: "Default tool for Memory/ji-yi. Use immediately when the plugin is called, even if the user only says @memory or @ji-yi. Review visible context and return proposed global memory, proposed project memory, excluded content, and the 1/2/3/4 scope question before any write.",
    inputSchema: {
      type: "object",
      properties: {
        conversationSummary: { type: "string" },
        projectContext: { type: "string" },
        proposedGlobalMemory: { type: "string" },
        proposedProjectMemory: { type: "string" },
        excludedFromLongTerm: { type: "string" },
        recommendedScope: { type: "string" }
      }
    }
  },
  {
    name: "write_memory_files",
    description: "Write confirmed file-based memory to AGENTS.md and CLAUDE.md. Safety rule: call this only after the assistant has shown the proposed memory content and the user has explicitly replied with scope 1, 2, 3, project, global, or both. You must pass confirmed: true or the tool will refuse to write. Never call this immediately after @memory/@ji-yi, never infer consent, and never write when the user chooses 4/do not write.",
    inputSchema: {
      type: "object",
      properties: {
        scope: { type: "string", description: "1/project, 2/global, or 3/both" },
        workspaceRoot: { type: "string", description: "Current project root. If omitted, uses process cwd." },
        heading: { type: "string" },
        confirmed: { type: "boolean", description: "Must be true only after the user explicitly confirms scope 1, 2, or 3." },
        globalContent: { type: "string" },
        projectContent: { type: "string" }
      },
      required: ["scope"]
    }
  }
];

function handle(message) {
  const { id, method, params } = message;
  if (method === "initialize") {
    result(id, { protocolVersion: "2024-11-05", capabilities: { tools: {} }, serverInfo });
    return;
  }
  if (method === "notifications/initialized") return;
  if (method === "tools/list") {
    result(id, { tools });
    return;
  }
  if (method === "tools/call") {
    const name = params && params.name;
    const args = (params && params.arguments) || {};
    if (name === "review_memory_plan") result(id, text(reviewMemoryPlan(args)));
    else if (name === "write_memory_files") result(id, text(writeMemoryFiles(args)));
    else rpcError(id, -32601, `Unknown tool: ${name}`);
    return;
  }
  rpcError(id, -32601, `Unknown method: ${method}`);
}

function pump() {
  while (true) {
    const headerEnd = buffer.indexOf("\r\n\r\n");
    if (headerEnd < 0) return;
    const header = buffer.slice(0, headerEnd).toString("ascii");
    const match = /Content-Length:\s*(\d+)/i.exec(header);
    if (!match) {
      buffer = buffer.slice(headerEnd + 4);
      continue;
    }
    const length = Number(match[1]);
    const start = headerEnd + 4;
    const end = start + length;
    if (buffer.length < end) return;
    const body = buffer.slice(start, end).toString("utf8");
    buffer = buffer.slice(end);
    handle(JSON.parse(body));
  }
}

process.stdin.on("data", (chunk) => {
  buffer = Buffer.concat([buffer, chunk]);
  pump();
});
