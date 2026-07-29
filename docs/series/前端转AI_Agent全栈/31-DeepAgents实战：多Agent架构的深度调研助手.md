---
id: aiagent31
slug: /aiagent31
title: 31-DeepAgents实战：多Agent架构的深度调研助手
date: 2002-09-26
authors: 鲸落
tags: [AI]
keywords: [AI]
---



## 前言

前面学了DeepAgents的各种 middleware，但是太散了。而且 middleware 里带的tool 需要在prompt 里说明怎么用。那有没有一个整合所有中间件的api，并且内置了prompt呢?

有的，就是 createDeepAgent

我们基于 deepagents开发一个多Agent 项目：深度调研助手

你只要给它一个主题，它的主Agent 会自动规划任务，列出todo列表，然后交给不同的子Agent来执行任务，比如联网搜索、代码执行等，最后生成一份调研报告

![image-20260729223247671](https://img.xiaojunnan.cn/image-20260729223247671.png)

我们分了三个子Agent：

- **主Agent**：整个系统的编排中心，负责把用户输入的调研主题拆解成可执行流程，并协调各子Agent分工完成。它不亲自包揽所有调研细节，而是按「规划一调研一分析一起草一审阅一定稿」推进任务：先用待办列表明确步骤，再按需委派子Agent，最后由自己整合材料、撰写报告并根据编辑反馈修订定稿。
- **调研员子Agent(researcher)**：每次只负责一个聚焦的子主题。通过联网搜索收集资料，将关键事实与来源URL整理成结构化摘要，写入findings_*.md。多个调研员可并行工作，适合把大主题拆成若干子方向同时推进。
- **分析师子Agent(analyst)**：当调研涉及数字对比、排名、增长率等计算时启用。在QuickJS REPL中执行JavaScript完成数值分析，禁止凭猜测给出数字。结果写入analysis_*.md，供主Agent写报告时引I用。
- **编辑子Agent(editor)**：在报告草稿完成后介入，从准确性、结构完整性、来源引用、语
  言表述等维度审阅，返回具体修改建议。编辑不直接改写报告，审阅与修订分离，便于主
  Agent在保持整体思路的前提下做针对性修改。
  大概有这个4个Agent



## 试试

.env
```
OPENAI_API_KEY=sk-xx
OPENAI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
OPENAI_MODEL=qwen-plus

# 用于身份验证，实现链路上报  
LANGCHAIN_API_KEY=xx
# 指定LangSmith中的项目，追踪结果会归类到该项目下
LANGCHAIN_PROJECT=deep-research-assistant
# 开启LangSmith追踪功能
LANGCHAIN_TRACING_V2=true

BOCHA_API_KEY=sk-xx
```

开启langsmith追踪

这里用到网络搜索，配置下博查的apikey



### 网络搜索的tool

然后创建 src/tools/search.mjs

```js
import { tool } from "langchain";
import { z } from "zod";

const BOCHA_API_URL = "https://api.bochaai.com/v1/web-search";

function formatWebPages(webpages) {
  return webpages
    .map(
      (page, idx) =>
        `引用: ${idx + 1}
标题: ${page.name ?? ""}
URL: ${page.url ?? ""}
摘要: ${page.summary ?? ""}
网站名称: ${page.siteName ?? ""}
网站图标: ${page.siteIcon ?? ""}
发布时间: ${page.dateLastCrawled ?? ""}`,
    )
    .join("\n\n");
}

async function bochaWebSearch(query, count) {
  const apiKey = process.env.BOCHA_API_KEY?.trim();
  if (!apiKey) {
    return "Bocha 联网搜索的 API Key 未配置（环境变量 BOCHA_API_KEY），请先在 .env 中配置后再重试。";
  }

  const response = await fetch(BOCHA_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      freshness: "noLimit",
      summary: true,
      count,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return `搜索 API 请求失败，状态码: ${response.status}，错误信息: ${errorText}`;
  }

  let json;
  try {
    json = await response.json();
  } catch (e) {
    return `搜索 API 请求失败，原因是：搜索结果解析失败 ${e.message}`;
  }

  try {
    if (json.code !== 200 || !json.data) {
      return `搜索 API 请求失败，原因是: ${json.msg ?? "未知错误"}`;
    }

    const webpages = json.data.webPages?.value ?? [];
    if (!webpages.length) {
      return `未找到与「${query}」相关的结果。`;
    }

    return formatWebPages(webpages);
  } catch (e) {
    return `搜索 API 请求失败，原因是：搜索结果解析失败 ${e.message}`;
  }
}

export const webSearch = tool(
  async (input) => {
    const count = input.count ?? 10;
    console.log(`  🔎 搜索: ${input.query}（${count} 条）`);
    return bochaWebSearch(input.query, count);
  },
  {
    name: "web_search",
    description:
      "使用 Bocha 联网搜索 API 检索互联网网页。输入中文或中英结合的搜索关键词，可选 count 指定结果数量。返回标题、URL、摘要、网站名称、图标和发布时间。",
    schema: z.object({
      query: z
        .string()
        .min(1)
        .describe("搜索关键词，优先使用中文，例如：2026年 AI Agent 框架对比、LangGraph 最新动态"),
      count: z
        .number()
        .int()
        .min(1)
        .max(20)
        .optional()
        .describe("返回的搜索结果数量，默认 10 条"),
    }),
  },
);
```

这个就是网络搜索的tool



### 4个Agent

然后写下4个Agent：

src/agent.mjs

```js
import path from "node:path";
import { fileURLToPath } from "node:url";
import dedent from "dedent";
import { ChatOpenAI } from "@langchain/openai";
import { createCodeInterpreterMiddleware } from "@langchain/quickjs";
import { createDeepAgent, FilesystemBackend } from "deepagents";

import { webSearch } from "./tools/search.mjs";

const projectDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

const researcherSubAgent = {
  name: "researcher",
  description:
    "通过联网搜索调研单一子主题。每次只分配一个子主题；多个独立子主题可并行启动多个调研员。",
  systemPrompt: dedent`
    你是一名专业调研员，负责调研**一个**分配给你的子主题，并写入**一份**调研结果文件。

    ## 工作流程（严格遵守，禁止空转循环）

    1. **可选**：用 write_todos 列出最多 3 条中文执行步骤（例如「搜索官方文档」「搜索社区评价」「整理并写入 findings」），然后按步骤执行
    2. 最多调用 3 次 web_search（硬性上限，绝不超过）
    3. 将搜索结果整理为结构化摘要，包含关键事实与来源 URL
    4. 调用 write_file **一次**，保存到任务指定的路径（必须在 /workspace/sources/findings_*.md 下，禁止写到其他目录）
    5. 用一句话确认已完成，然后**立即停止**，不要再搜索、写文件或更新 todo

    ## write_todos 使用规则（若使用）

    - 最多 3 条，每条 content 必须用中文
    - 仅用于拆解本子的调研步骤，不要重复主 Agent 已完成的总体规划
    - 最后一条 todo 必须是「写入 findings 文件」；该步骤完成后将所有 todo 标为 completed 并结束

    ## 其他规则

    - 不要重复相同的搜索关键词
    - write_file 完成后禁止再次搜索——你的任务已结束
    - 其他人只能看到你写入的文件，内容必须完整、自洽
    - **所有输出必须使用中文**（专有名词如 LangGraph 可保留英文）
    - 搜索关键词优先使用中文；若主题本身是英文专有名词，可中英结合
  `,
  tools: [webSearch],
};

const editorSubAgent = {
  name: "editor",
  description:
    "审阅报告草稿的准确性、结构与完整性。在 /workspace/reports/draft_*.md 写好后使用。",
  systemPrompt: dedent`
    你是一名资深情报编辑，负责**审阅**报告草稿——**不要**亲自改写报告。

    ## 阅读材料

    - 原始问题：/workspace/sources/question.txt
    - 待审草稿：任务中指定的路径
    - 支撑材料：/workspace/sources/ 下的调研文件（如需要）

    ## 审阅要点

    - 报告是否直接回答了原始问题？
    - 章节结构是否清晰，段落是否充实（而非只有 bullet 列表）？
    - 是否引用了来源，并在「参考资料」章节列出？
    - 是否有遗漏、无依据的断言或缺失的视角？
    - 语言是否为中文，表述是否专业？

    ## 输出

    返回简洁的审阅意见和具体、可操作的修改建议。
    **不要**写入报告文件，只提供反馈。所有输出使用中文。
  `,
};

const analystSubAgent = {
  name: "analyst",
  description:
    "使用 eval REPL 进行数值计算与结构化数据分析。适用于计算、排名、同比对比或 JSON/CSV 分析。",
  systemPrompt: dedent`
    你是一名数据分析师，所有计算必须通过 eval REPL 完成——**禁止**猜测数字。

    ## 工作流程

    1. 从 /workspace/sources/ 读取数据文件（或从调研结果中提取数字）
    2. 在 REPL 中编写并运行 JavaScript，计算总和、均值、排名、增长率等
    3. 将分析结果保存到 /workspace/sources/analysis_*.md，包含计算逻辑与结论

    必须展示计算过程，结论可从 REPL 输出复现。所有输出使用中文。
  `,
  middleware: [createCodeInterpreterMiddleware()],
};

const orchestratorPrompt = dedent`
  你是「深度调研助手」的主 Agent，负责协调调研、分析与编辑，产出高质量调研简报。

  ## 语言要求

  - **所有输出必须使用中文**：对话回复、write_todos 任务列表、文件内容、搜索关键词
  - write_todos 中每条 todo 的 content 必须用中文描述，例如「撰写调研计划」「委派调研员调研 LangGraph」
  - 搜索时优先使用中文关键词；英文专有名词（如 LangGraph、AutoGen）可保留
  - 报告、调研笔记、计划文件全部用中文撰写

  ## 你的职责

  协调调研员、分析师和编辑完成报告。不要亲自完成所有调研——将专业工作委派给子 Agent。

  ## 标准流程

  1. **规划** — 用 write_todos 拆解任务（中文）。将用户问题保存到 /workspace/sources/question.txt
  2. **调研** — 按 web-research 技能：写 research_plan.md，委派调研员子 Agent（可并行）
  3. **分析** — 若涉及数字对比或数据表，委派分析师子 Agent
  4. **起草** — **由你亲自**按 report-writer 技能撰写，用 write_file 写入 /workspace/reports/draft_[主题].md
  5. **审阅** — 委派编辑子 Agent 审稿，根据反馈修订一次
  6. **定稿** — 保存最终报告到 /workspace/reports/report_[主题]_[日期].md

  ## task 工具（子 Agent 委派）

  **仅**以下 subagent_type 合法：researcher、analyst、editor、general-purpose。

  - web-research、report-writer 是**技能**（写作指南），**不是**子 Agent，禁止作为 subagent_type 调用
  - 报告起草、修订、定稿由**主 Agent 自己**用 write_file / edit_file 完成，不要委派 task

  ## 委派规则

  - 每个调研员只负责一个聚焦的子主题
  - **每份报告最多 3 个调研员**——只选最相关的子主题
  - 框架对比类任务：优先调研用户明确点名的框架；否则选最重要的 3 个
  - 最多并行启动 3 个调研员，已有 3 份 findings 文件后不再新增调研员
  - 仅在确实需要数值计算时使用分析师
  - 每份报告只调用编辑一次（草稿完成后）
  - 调研完成后直接进入起草 → 审阅 → 定稿，不要额外开调研轮次

  ## 文件约定

  - 计划与原始资料：/workspace/sources/
  - 草稿与终稿：/workspace/reports/
  - 同一时间只编辑一个文件，避免冲突

  ## 完成时告知用户

  - 最终报告保存路径
  - 2–3 句话的核心发现摘要
  - 调研中的局限或信息缺口
`;

export function createIntelligenceDeskAgent() {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("未设置 OPENAI_API_KEY 环境变量");
  }

  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o";
  const baseURL = process.env.OPENAI_BASE_URL?.trim() || undefined;

  const backend = new FilesystemBackend({
    rootDir: projectDir,
    virtualMode: true,
  });

  
  const chatModel = new ChatOpenAI({
    model,
    temperature: 0,
    apiKey,
    ...(baseURL
      ? {
          configuration: {
            baseURL,
          },
        }
      : {}),
  });

  // Object.defineProperty(chatModel, "profile", {
  //   get: () => ({ maxInputTokens: 8_000 }),
  // });

  return createDeepAgent({
    model: chatModel,
    systemPrompt: orchestratorPrompt,
    backend,
    memory: [path.join(projectDir, "AGENTS.md")],
    skills: ["/skills/"],
    subagents: [researcherSubAgent, editorSubAgent, analystSubAgent]
  });
}

export { projectDir };
```

我们直接用createDeepAgent 的api，这样不用自己组装middleware 了，配置下 skills目录、memory的文件路径、子agent就好了。

这里的dedent是去掉换行和缩进的空格，换成\n的：

![image-20260729224001145](https://img.xiaojunnan.cn/image-20260729224001145.png)

写代码的时候正常缩进，用这个可以自动去掉换成 \n

然后分析的子Agent 需要执行代码，用到了 quickjs这个js引擎来执行：

![image-20260729224035436](https://img.xiaojunnan.cn/image-20260729224035436.png)

![image-20260729224041571](https://img.xiaojunnan.cn/image-20260729224041571.png)



### cli

还有一个src/cli.mjs就是调用这个agent，格式化下输出

```js
import { config as loadEnv } from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { HumanMessage } from "@langchain/core/messages";

import { createIntelligenceDeskAgent, projectDir } from "./agent.mjs";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
loadEnv({ path: path.join(projectRoot, ".env") });

const recursionLimit = Number(process.env.RECURSION_LIMIT) || 300;

const FILE_TOOLS = new Set([
  "write_file",
  "edit_file",
  "read_file",
  "ls",
  "glob",
  "grep",
]);

const EVAL_TOOL = "eval";
const PREVIEW_LEN = 100;
const RESULT_PREVIEW_LEN = 120;

function printBanner() {
  console.log("╔══════════════════════════════════════════╗");
  console.log("║              深度调研助手              ║");
  console.log("╚══════════════════════════════════════════╝\n");
}

async function readQuery() {
  const fromArgs = process.argv.slice(2).join(" ").trim();
  if (fromArgs) return fromArgs;

  const rl = readline.createInterface({ input, output });
  try {
    return (await rl.question("请输入调研主题: ")).trim();
  } finally {
    rl.close();
  }
}

function stepLabel(namespace, node) {
  if (namespace.length === 0) return `[主 Agent] ${node}`;
  const id = namespace[0]?.replace(/^tools:/, "subagent:") ?? namespace[0];
  return `[${id}] ${node}`;
}

function displayPath(p) {
  return p.startsWith("/workspace/") ? p.slice(1) : p.replace(/^\/+/, "");
}

function pathFromArgs(name, args) {
  if (!args || typeof args !== "object") return null;
  if (name === "write_file" || name === "edit_file" || name === "read_file") {
    return typeof args.file_path === "string" ? args.file_path : null;
  }
  if (name === "ls") return typeof args.path === "string" ? args.path : null;
  if (name === "glob" || name === "grep") {
    const dir = typeof args.path === "string" ? args.path : "/";
    const pattern = typeof args.pattern === "string" ? args.pattern : "";
    return pattern ? `${pattern} @ ${dir}` : dir;
  }
  return null;
}

function parseArgs(args) {
  if (typeof args === "string") {
    try {
      return JSON.parse(args);
    } catch {
      return args;
    }
  }
  return args;
}

function previewText(text, maxLen) {
  const oneLine = String(text).replace(/\s+/g, " ").trim();
  if (!oneLine) return "(empty)";
  return oneLine.length <= maxLen ? oneLine : `${oneLine.slice(0, maxLen - 1)}…`;
}

function trackEvalCalls(data, pendingEval) {
  for (const msg of data?.messages ?? []) {
    for (const tc of msg.tool_calls ?? []) {
      if (!tc.id || tc.name !== EVAL_TOOL) continue;
      const args = parseArgs(tc.args);
      const code =
        args && typeof args === "object" && typeof args.code === "string"
          ? args.code
          : "";
      pendingEval.set(tc.id, code);
      console.log(`  🧮 eval: ${previewText(code, PREVIEW_LEN)}`);
    }
  }
}

function trackFileCalls(data, pending) {
  for (const msg of data?.messages ?? []) {
    for (const tc of msg.tool_calls ?? []) {
      if (!tc.id || !tc.name || !FILE_TOOLS.has(tc.name)) continue;
      const p = pathFromArgs(tc.name, parseArgs(tc.args));
      if (p) pending.set(tc.id, { name: tc.name, path: p });
    }
  }
}

function logToolResults(data, pending, pendingEval) {
  for (const msg of data?.messages ?? []) {
    if (msg.type !== "tool") continue;

    if (msg.name === "task") {
      const preview = String(msg.content).slice(0, 120).replace(/\n/g, " ");
      console.log(`  task done: ${preview}...`);
      continue;
    }

    if (msg.name === EVAL_TOOL) {
      console.log(
        `  🧮 eval → ${previewText(msg.content, RESULT_PREVIEW_LEN)}`,
      );
      if (msg.tool_call_id) pendingEval.delete(msg.tool_call_id);
      continue;
    }

    if (!msg.name || !FILE_TOOLS.has(msg.name)) continue;

    const op = msg.tool_call_id ? pending.get(msg.tool_call_id) : undefined;
    const filePath =
      op?.path ?? String(msg.content).match(/['`](\/[^'`]+)['`]/)?.[1] ?? null;

    console.log(
      filePath ? `  ${msg.name}: ${displayPath(filePath)}` : `  ${msg.name}`,
    );
    if (msg.tool_call_id) pending.delete(msg.tool_call_id);
  }
}

async function run(query) {
  console.log(`query: ${query}`);
  console.log(`recursionLimit: ${recursionLimit}\n`);
  console.log("─".repeat(50));

  const agent = createIntelligenceDeskAgent();
  const pending = new Map();
  const pendingEval = new Map();

  for await (const [namespace, chunk] of await agent.stream(
    { messages: [new HumanMessage(query)] },
    { streamMode: "updates", subgraphs: true, recursionLimit },
  )) {
    for (const [node, data] of Object.entries(chunk)) {
      if (node === "model_request") {
        trackFileCalls(data, pending);
        trackEvalCalls(data, pendingEval);
        console.log(stepLabel(namespace, node));
      } else if (node === "tools") {
        logToolResults(data, pending, pendingEval);
      } else if (node === "todoListMiddleware.after_model") {
        console.log(stepLabel(namespace, node));
      }
    }
  }

  console.log("─".repeat(50));
}

function listMd(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => path.join(dir, f))
    .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
}

function printOutputs() {
  const sources = listMd(path.join(projectDir, "workspace/sources"));
  const reports = listMd(path.join(projectDir, "workspace/reports"));

  if (sources.length) {
    console.log("\n sources:");
    for (const f of sources.slice(0, 8)) {
      console.log(`   ${path.relative(projectDir, f)}`);
    }
  }
  if (reports.length) {
    console.log("\n reports:");
    for (const f of reports.slice(0, 5)) {
      console.log(`   ${path.relative(projectDir, f)}`);
    }
  }
}

async function main() {
  printBanner();

  if (!process.env.OPENAI_API_KEY?.trim()) {
    console.error("Missing OPENAI_API_KEY — copy .env.example to .env");
    process.exit(1);
  }

  const query = await readQuery();
  if (!query) {
    console.error("请提供调研主题");
    process.exit(1);
  }

  try {
    await run(query);
    printOutputs();
    console.log("\n✅ done");
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("Recursion limit")) {
      console.error(`\n❌ recursion limit (${recursionLimit}) — set RECURSION_LIMIT in .env`);
    } else {
      console.error("\n❌", err);
    }
    printOutputs();
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```



### 两个skill

report-writer和web-research

```markdown
---
name: report-writer
description: 将调研结果整理为结构清晰、专业的中文情报报告
---

# 报告撰写技能

将调研 findings 综合为最终交付物时使用本技能。

> **注意**：本技能是主 Agent 的写作指南，不是子 Agent。请主 Agent 亲自用 `write_file` 撰写报告，**不要**通过 `task` 工具委派 `report-writer`。

## 报告结构

1. **标题** — `# [主题]：情报简报`
2. **执行摘要** — 3–5 条核心要点
3. **背景** — 主题背景与当前重要性
4. **核心发现** — 按主题组织，而非按来源堆砌
5. **分析** — 趋势、影响、风险、机遇
6. **结论** — 直接回答原始问题
7. **参考资料** — 编号列表，格式 `[标题](URL)`

## 写作规范

- **全文使用中文**（专有名词可保留英文）
- 第三人称专业表述，禁止「我调研了」「我发现」等自述
- 关键论断 inline 引用 `[标题](URL)`
- 每节内容充实（多段落），避免一句话带过
- 对比类报告：每项单独一节，再加综合对比节

## 文件命名

- 草稿：`/workspace/reports/draft_[主题slug].md`
- 终稿：`/workspace/reports/report_[主题slug]_[YYYY-MM-DD].md`

写完草稿后委派 **editor（编辑）** 审阅，根据反馈修订一次，再保存终稿。
```

````markdown
---
name: web-research
description: 结构化多来源联网调研，支持并行委派调研员子 Agent
---

# 联网调研技能

当用户要求调研、调查、对比或深度分析某个主题时使用本技能。

> **注意**：本技能是主 Agent 的流程指南，不是子 Agent。联网搜索请委派 `researcher` 子 Agent，**不要**将 `web-research` 作为 subagent_type 调用。

## 流程

### 1. 规划

1. 将用户问题写入 `/workspace/sources/question.txt`
2. 创建 `/workspace/sources/research_plan.md`，包含（**中文撰写**）：
   - 主调研问题
   - 2–4 个互不重叠的子主题
   - 每个子主题的预期产出
   - 综合策略

### 2. 委派（可并行）

对每个子主题，用 `task` 工具启动 **researcher（调研员）** 子 Agent：

```
调研【具体子主题】。可用 write_todos 列出最多 3 条中文步骤（可选）。
使用 web_search 搜索（最多 10 次，关键词用中文）。
将 findings 保存到 /workspace/sources/findings_[子主题slug].md，写入后结束。
```

子主题相互独立时，最多并行 3 个调研员。**总数不超过 3 个。**

### 3. 综合

1. 读取所有 `/workspace/sources/findings_*.md`
2. 整合为连贯分析
3. 定稿前委派 **editor（编辑）** 子 Agent 审阅

## 最佳实践

- 委派前必须先写 research_plan.md
- 每个调研员只负责一个聚焦子主题
- Agent 之间通过文件传递信息，不要依赖对话历史
- 搜索关键词优先使用中文
````

skill就是对prompt的封装，这里就是告诉agent怎么网络搜索、怎么写报告的



### 跑一下

```
node src/cli.mjs "调研国家统计局公开的2023年省级地区生产总值（GDP）数据：提取GDP总量前6名省份的具体数值及同 比增速，计算六省GDP总和、各省占全国GDP的比重，并按增速从高到低排名"
```

这样，一个可以加载 skills、有自动读取长期记忆Agents.md、多个子Agent 的Agent就完成了。

网络搜索的tool 前面用过几次了。

重点是这个沙箱执行代码的tool

![image-20260729224921778](https://img.xiaojunnan.cn/image-20260729224921778.png)

大模型不会数学计算，涉及到计算的都是生成代码，用eval 的tool来执行，这里是js代码用 quickjs 引擎来执行。

当然，你生成别的语言的代码也行，用对应的引擎执行即可。

这里有个langsmith 小技巧：

![image-20260729225035605](https://img.xiaojunnan.cn/image-20260729225035605.png)

可以通过filter过滤出所有的tool来，更容易理清流程。



### todo

最后就是todo了，复杂任务不能走一步想一步，都要提前生成todo列表，一步步执行

主agent的todo列表：

![image-20260729225143224](https://img.xiaojunnan.cn/image-20260729225143224.png)

当前的是in_progress,完成后会标记为completed

这个是调研员子Agent的todo列表：

![image-20260729225208137](https://img.xiaojunnan.cn/image-20260729225208137.png)

其实这个中间件是langchain提供的，我们用一下试试:

src/todo-middleware-test.mjs

```js
import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import {
  createAgent,
  HumanMessage,
  todoListMiddleware,
} from "langchain";

const model = new ChatOpenAI({
  model: process.env.OPENAI_MODEL,
  apiKey: process.env.OPENAI_API_KEY,
  temperature: 0,
  configuration: { 
    baseURL: process.env.OPENAI_BASE_URL
  }
});

const agent = createAgent({
  model,
  tools: [],
  systemPrompt:
    "你是生活规划助手。收到需要多步完成的请求时，先用 write_todos 列出中文执行步骤，然后简要说明你的计划。",
  middleware: [todoListMiddleware()],
});

const query =
  "我下周末想带爸妈去杭州玩两天，帮我规划一下：交通怎么选、住哪里方便、必去景点和吃什么，预算控制在人均 1500 元左右。";

const result = await agent.invoke({
  messages: [new HumanMessage(query)],
});

console.log("todos:", JSON.stringify(result.todos, null, 2));
console.log("─".repeat(50));
console.log("回复:", result.messages.at(-1)?.content);
```

用 createAgent + todoListMiddleware

这个中间件自带了write_todos 的tool,会生成todo列表写到graph的 state里

这是langchain提供的中间件：`todoListMiddleware`

我们的Agent里也可以用。

通过这个agent, 我们把 deepagents 的 createDeepAgent 的 todo 规划、 多Agent 执行、skill、memory等用了一遍。

相比自己调用中间件，它集成了各种中间件，内置了对应的prompt，用起来更简单。

![image-20260729225820619](https://img.xiaojunnan.cn/image-20260729225820619.png)

![image-20260729225840335](https://img.xiaojunnan.cn/image-20260729225840335.png)



### 上下文压缩

上下文压缩这块，内置逻辑是每个模型有输入上下文限制，达到85%会触发总结，保留10%

![image-20260729225859524](https://img.xiaojunnan.cn/image-20260729225859524.png)

qwen模型没这个，我们我们可以这样改：src/max-input-tokens-test.mjs

```js
import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
    model: process.env.OPENAI_MODEL,
    apiKey: process.env.OPENAI_API_KEY,
    temperature: 0,
    configuration: { 
      baseURL: process.env.OPENAI_BASE_URL
    }
});

console.log(model.profile.maxInputTokens);

Object.defineProperty(model, "profile", {
  get: () => ({ maxInputTokens: 1_024 }),
});

console.log(model.profile.maxInputTokens);
```

我们改下这个值，就可以实现对上下文压缩触发阈值的修改：

![image-20260729225945678](https://img.xiaojunnan.cn/image-20260729225945678.png)

![image-20260729230006200](https://img.xiaojunnan.cn/image-20260729230006200.png)

而且，触发摘要后，会把会话原文记录在conversation_history目录下归档

![image-20260729230025048](https://img.xiaojunnan.cn/image-20260729230025048.png)



## 总结

我们基于 DeepAgents 的createDeepAgent api实现了深度调研助手。

这是一个多Agent架构的agent

主Agent会列出todo列表，按步执行，具体的调研、数据计算分析、报告编辑，由三个子Agent负责，它们有各自的能力，比如网络搜索、沙盒执行代码

子Agent执行的时候，如果需要多个步骤，也是先列todo列表再执行，比如调研的时
候。执行完更改todo任务状态。

Agents.md的长期记忆、skill执行等都是内置了，配置一下就行。

上下文压缩也是内置功能，可以修改profile.maxInputTokens 来修改触发阈值。

这样，我们没有写很多代码，就完成了一个多Agent架构支持skill的功能比较完善的Agent，这就是 DeepAgents开发Agent 的好处，有很多开箱即用的能力。



































































