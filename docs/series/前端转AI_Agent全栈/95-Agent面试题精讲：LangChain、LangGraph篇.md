---
id: aiagent95
slug: /aiagent95
title: 95-Agent面试题精讲：LangChain、LangGraph篇
date: 2002-09-26
authors: 鲸落
tags: [AI]
keywords: [AI]
---



## 前言



## 你了解过哪些 AI Agent 开发框架？

我重点了解过 LangChain、LangGraph 和 LlamaIndex。

LangChain 提供模型、Prompt、工具、Agent 和中间件等通用抽象，集成范围比较广，适合快速构建工具调用、RAG、SQL 查询等 AI 应用。

LangGraph 更偏底层的状态与流程编排。面对循环、分支、并行、断点恢复和人工审批等复杂流程时，可以使用图结构显式控制 Agent 的执行路径。现在 LangChain 的 Agent 也运行在 LangGraph 之上，因此二者更多是上下层关系，而不是互相替代的竞争关系。

LlamaIndex 的优势集中在数据接入、文档解析、索引和检索，适合企业知识库、文档问答和复杂 RAG 等数据密集型应用。

除此之外，我也了解 OpenAI Agents SDK 和 CrewAI。前者适合以 OpenAI 模型为主的轻量 Agent，后者擅长使用角色和任务表达多 Agent 协作。不过在通用 Python Agent 开发岗位中，我会优先掌握 LangChain、LangGraph 和 LlamaIndex，再根据公司的技术栈补充其他框架。



## 请你谈谈对 LangChain 中核心概念「Chain」的理解，以及它的核心作用与设计理念。

我理解的 Chain，不是某一个固定的类，而是一种应用编排思路：把 Prompt、模型、检索器、输出解析器和自定义逻辑等步骤，按照明确的数据流连接起来，让上一步的输出成为下一步的输入，最终形成一个可以整体执行的流程。

在现在的 LangChain 里，Chain 最重要的技术基础是 `Runnable`。每个步骤都尽量遵守统一的输入输出和执行接口，再通过 LCEL 的 `|` 做串行组合，或者通过字典、`RunnableParallel` 做并行组合。

组合后的整条 Chain 本身仍然是 Runnable，所以可以继续嵌套，也能统一使用 `invoke`、`ainvoke`、`batch` 和 `stream` 等能力。

它的核心设计理念是「组合优于堆积封装」。开发者只关注每一步做什么、数据怎么流动，框架负责把执行方式、配置、重试、回退和追踪等通用能力接到整条流程上。

需要注意版本边界。`LLMChain`、`SequentialChain` 属于旧式 Chain API，LangChain v1 已把这类能力移入 `langchain-classic`，适合维护旧项目，不应再作为新项目的首选写法。

确定性的线性或分支流程可以用 Runnable 和 LCEL，Agent 让模型在运行时动态决定下一步；带循环、持久状态和人工审批的复杂工作流，则更适合用 LangGraph。



## LangChain 的底层架构与实现原理是什么？

当前 LangChain v1 更像一套面向 Agent 的分层开发框架，而不只是将 Prompt 串起来的 Chain 工具。

底层的 `langchain-core` 定义 Message、Model、Tool 和 Runnable 等标准协议；不同模型厂商的独立集成包负责把自己的请求与响应适配到这些协议，因此应用层可以使用相对统一的方式切换模型和工具。

在执行层，Runnable 统一了组件的同步、异步、批处理和流式调用方式。对于步骤固定的流程，可以使用 LCEL 组合 Prompt、Model 和 Parser；对于需要模型自主选择工具的任务，则使用 `create_agent` 创建 Agent。

`create_agent` 会把模型节点和工具节点编译成 LangGraph 状态图。模型读取消息后生成 `AIMessage`；如果其中包含 `tool_calls`，运行时执行对应工具，并把结果包装成带相同调用 ID 的 `ToolMessage` 写回状态；模型再次读取工具结果并继续判断，直到生成最终回答。

在这套架构中，State 保存会变化的消息与业务状态，Runtime 提供可信上下文和长期 Store，Middleware 负责在模型或工具调用前后加入权限、重试、摘要与人工审批，LangGraph 则负责路由、检查点、暂停恢复和长时间运行。

一句话概括：LangChain 用标准协议统一组件，用 `create_agent` 提供高层 Agent 入口，再由 LangGraph 承担有状态的执行运行时。



## 使用 LangChain 构建 Agent 的核心步骤是什么？

我通常分七步构建 LangChain Agent。

第一，明确任务边界，包括 Agent 能做什么、不能做什么、何时结束，以及什么结果算成功。

第二，选择支持所需工具调用和结构化输出能力的模型，并把数据库、搜索和业务 API 封装为职责单一、Schema 清晰的 Tools。

第三，使用 `system_prompt` 约束角色、工具使用规则和失败策略；如果结果还要交给程序处理，则使用 `response_format` 定义结构化输出。

第四，通过 `create_agent` 组装模型、工具、提示词和输出格式。它底层使用 LangGraph，在模型判断、工具执行和工具结果回传之间循环。

第五，补充状态与安全能力。使用 Checkpointer 按 `thread_id` 保存当前线程状态，使用 Store 管理跨线程信息，通过 Middleware 添加重试、摘要、权限控制和人工审批。

第六，根据场景选择同步、异步或流式调用，并设置超时、并发和取消策略。

第七，先单测 Tool，再测试 Agent 的工具选择与调用轨迹，最后通过 Trace 观察模型调用、工具参数、耗时、Token 和异常。



## 在 LangChain 中，如何为 Agent 注册工具？

LangChain 中注册 Tool 的本质，是同时向模型提供一份工具说明，并向运行时提供一个真正可执行的函数。工具说明主要包含名称、用途和参数 Schema，模型根据它选择工具并生成参数，LangChain 再执行对应函数。

最常用的实现方式有四种：

1. 简单的已有函数，可以带上类型注解和 docstring 后直接放入 `tools`。
2. 大多数业务工具使用 `@tool`，便于自定义名称、描述和参数 Schema。
3. 需要在运行时组装同步函数、异步函数和 Schema 时，可以使用 `StructuredTool`。
4. 工具需要封装客户端、维护资源或定制执行过程时，再继承 `BaseTool`。

在 LangChain v1 中，通常通过 `create_agent(model=..., tools=[...])` 完成注册。城市、关键词、订单号等任务参数可以让模型填写；用户 ID、租户、权限和存储对象等可信参数，应通过 `ToolRuntime` 从运行时注入，不能暴露给模型。

生产环境还要关注参数校验、权限检查、超时、重试、幂等和错误分类。只有网络超时等临时故障适合自动重试，参数错误和业务拒绝应该返回清楚的信息，程序 Bug 则不应该被统一吞掉。



## LangChain 如何实现短期记忆和长期记忆？

在 LangChain v1 中，可以用一句话区分两类记忆：

```text
短期记忆 = State + thread_id + Checkpointer
长期记忆 = namespace/key + Store
```

短期记忆属于当前会话线程。Agent State 保存消息、当前步骤和中间结果；Checkpointer 按 `thread_id` 保存状态快照。使用同一个 `thread_id` 再次调用时，可以恢复前面的对话和执行状态。

长期记忆不应该绑定某个线程，而是保存到 Store。Store 使用 namespace 和 key 组织数据，namespace 通常包含租户、用户和记忆类型。即使用户新建了线程，只要使用相同的可信用户身份和 namespace，仍然可以读取以前保存的偏好或经验。

工具可以通过 `ToolRuntime` 读取当前 State、可信 Context 和长期 Store。用户 ID、租户和权限应由应用运行时注入，不能让模型自己填写。

长对话还需要控制上下文：裁剪只减少本次模型输入，删除会真正移除持久状态，摘要则用更短文本保留主要语义。生产环境要使用数据库型 Checkpointer 和 Store，并做好租户隔离、写入幂等、记忆更正、过期删除、敏感信息保护和检索评测。





## 请你详细说说 LangChain 和 LangGraph 的核心区别是什么？

我不会把 LangChain 和 LangGraph 理解成两个互相替代的竞品。按照当前官方定位，LangChain v1 是高层 Agent 开发框架，负责提供模型、工具、结构化输出和 middleware 等常用能力。

LangGraph 则是低层的 Agent 编排框架与运行时，让开发者直接设计状态、节点、路由、并行、中断和恢复。

两者最关键的关系是，LangChain v1 的 `create_agent` 构建在 LangGraph 之上，返回一个编译后的图。也就是说，LangChain Agent 不是脱离 LangGraph 运行的另一套引擎，它已经继承了 LangGraph 的状态、持久化、流式输出、durable execution 和 human-in-the-loop 等运行能力。

真正的区别不在于「有没有图」或「能不能分支」，而在于开发者控制哪一层。若需求是常见的「模型判断 -> 调用工具 -> 返回模型」循环，我会优先用 LangChain，再借助 middleware 做提示词、重试、护栏和审批等定制。

若业务需要显式控制多个阶段，让确定性步骤与 Agent 步骤混排，或者要处理复杂并行、长期暂停和多 Agent 协作，我会直接用 LangGraph。`create_agent` 生成的 Agent 仍然可以作为图中的节点或子图复用。

所以一句话概括：LangChain 帮我快速得到一个好用的 Agent，LangGraph 帮我精确控制整个 Agent 系统怎么运行。



## LangGraph 相比于 LangChain 有哪些核心优势？更适配哪些 Agent 场景？

我会先纠正一个前提：LangGraph 和 LangChain 不是互斥的两套 Agent 框架。LangChain v1 提供模型、工具、中间件和预构建 Agent loop，`create_agent` 本身就运行在 LangGraph 上；LangGraph 是更低层的编排框架与运行时，让开发者直接控制 State、节点、边、路由、并行、子图、中断和恢复。

因此，LangGraph 的核心优势不是「LangChain 没有这些能力」，而是把复杂 Agent 的运行过程变成显式、可持久化、可观察、可恢复的业务状态机。

我们既可以用 `StateGraph` 声明拓扑和共享状态，也可以用 Functional API 在普通 Python 控制流上增加检查点与恢复能力。

当任务会持续很久、必须人工审批、要从故障点继续，或者需要并行研究与多 Agent 协作时，LangGraph 的优势最明显。

Checkpointer 保存线程内状态快照，Store 保存跨线程长期记忆；`interrupt()` 可以暂停任意业务节点；时间旅行可以从旧 checkpoint 重放或分叉；节点级容错则让失败路径也能被建模。

如果需求只是常见的「模型选择工具 -> 调用工具 -> 返回模型」循环，我会优先使用 LangChain `create_agent`，再用 middleware 完成提示词、重试、护栏和审批等定制。

只有当业务拓扑、恢复边界或多角色协作成为主要复杂度时，我才直接使用 LangGraph，也常把 LangChain Agent 作为图中的节点或子图复用。



## Deep Research 的实现逻辑和适用场景是什么？

Deep Research 不是 LangChain 核心包里的一个固定开关，而是一类面向开放问题的研究型 Agent 架构。LangChain 团队提供了 `open_deep_research` 参考实现，也提供了更通用的 Deep Agents SDK；前者是具体研究应用，后者是通用 Agent 开发框架，不能混为一谈。

它的核心流程是：先澄清用户目标并生成 Research Brief，再由 Supervisor 把问题拆成相对独立的子课题。多个 Researcher 在隔离上下文中并行检索，并对来源进行筛选和压缩。

Supervisor 会检查证据是否覆盖研究目标，发现空白就继续补搜，最后再由统一的写作阶段综合证据并生成带引用的报告。

这种架构的价值不只是并行加速。子 Agent 可以隔离不同主题的上下文，避免大量搜索结果互相干扰；Supervisor 可以根据中间证据动态调整方向；统一写作则能减少章节重复和口径冲突。

它适合竞品分析、技术调研、文献综述和供应商尽调等开放式、多来源、可拆分任务，不适合一次搜索就能回答的简单事实，也不适合子任务高度依赖的强耦合工作。

生产环境必须限制并发、迭代、Token 和搜索预算，并对网页提示词注入、来源可信度和高风险结论进行人工复核。



## LangChain 大版本升级有哪些核心变化？

LangChain 的版本演进可以抓住四条主线。

第一是拆分核心与集成。稳定的消息、模型、Tool 和 Runnable 协议放进 `langchain-core`，第三方模型与向量库则迁到 `langchain-community` 或独立集成包，避免厂商 SDK 的变化频繁影响核心框架。

第二是使用 Runnable 和 LCEL 统一组件调用。Prompt、Model、Parser 等组件拥有一致的 `invoke`、`batch`、`stream` 和异步接口，确定性流程可以通过组合而不是不断继承新的 Chain 类实现。

第三是将 Agent 运行时转向 LangGraph。传统 Agent 执行器适合简单循环，却难以处理复杂状态、分支、暂停恢复和人工审批。LangGraph 将执行过程显式表示为状态图，成为 LangChain Agent 的底层运行基础。

第四是 LangChain v1 进一步聚焦 Agent。`create_agent` 成为高层入口，middleware 负责动态提示词、工具控制、摘要、重试和人工介入等横切能力，旧 Chain 等接口进入 `langchain-classic`。

这些变化的共同方向不是「增加更多类」，而是稳定核心抽象、解耦第三方集成、统一组合协议，并把复杂 Agent 交给可持久化、可恢复的图运行时。













