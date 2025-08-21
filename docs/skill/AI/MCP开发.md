---
id: mcpdev
slug: /mcpdev
title: MCP开发
date: 2002-09-26
authors: 鲸落
tags: [AI, MCP]
keywords: [AI, MCP]
---



## 在线代码

> https://github.com/lucianoayres/mcp-server-node

```sh
git clone https://github.com/lucianoayres/mcp-server-node.git

cd mcp-server-node

npm i

npm run inspector
```



## 示例代码

```js
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "MCP Server Boilerplate",
  version: "1.0.0",
});

server.tool(
  "查询天气", // 名称
  "查询某个城市现在的天气情况", // 描述
  {
    city: z.string().describe("城市名，例如 Beijing、Shanghai、Guangzhou"), // 必填
  },
  async ({ city }) => {
    try {
      const url = `https://wttr.in/${encodeURIComponent(city)}?format=j1`;
      const res = await fetch(url);
      const data = await res.json();

      if (!data || !data.current_condition) {
        return {
          content: [{ type: "text", text: `未能获取 ${city} 的天气信息` }],
        };
      }

      const current = data.current_condition[0];
      const desc = current.weatherDesc[0].value;
      const temp = current.temp_C;
      const feels = current.FeelsLikeC;
      const humidity = current.humidity;

      return {
        content: [
          { type: "text", text: `${city} 当前天气：${desc}` },
          { type: "text", text: `气温：${temp}°C，体感：${feels}°C` },
          { type: "text", text: `湿度：${humidity}%` },
        ],
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: `查询失败: ${err}` }],
      };
    }
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
```



