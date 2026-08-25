---
id: aiagent91
slug: /aiagent91
title: 91-Agent面试题精讲
date: 2002-09-26
authors: 鲸落
tags: [AI]
keywords: [AI]
---



## 一、Agent 整体效果

### 前言

这类是最高频的。

1. **如何评估一个 Agent 的任务完成率？**
2. **Task Success Rate 怎么定义？**
3. **如何设计端到端 Agent 测试用例？**
4. **如何模拟真实用户与 Agent 的交互？**
5. **Agent 的成功率下降了，怎么定位问题？**
6. **如何做 Agent 的回归测试？**
7. **如何构建 Agent Evaluation Dataset？**
8. **离线评测和线上评测有什么区别？**
9. **如何评估 Agent 的稳定性？**
10. **如何评估 Agent 的鲁棒性？**

其中 **“成功率下降了怎么排查”** 很值得准备，因为它很工程化。



### 如何评估一个 Agent 的任务完成率？

> 先定义什么情况下算“任务完成”，然后准备一批测试任务，让 Agent 全部跑一遍，统计真正完成了多少。

我会先根据具体业务定义任务成功标准，然后准备一批测试任务，让 Agent 批量执行。

最核心就是统计 Task Success Rate，也就是成功完成任务的数量除以总任务数量。

同时我不会只看最终结果，还会关注执行过程中有没有出现错误，比如任务中断、无限循环或者工具调用失败。最后结合自动评估和人工抽样来判断 Agent 的整体效果。



### Task Success Rate 怎么定义？

Task Success Rate 就是 Agent 成功完成任务的比例。

比如准备 100 个测试任务，其中有 85 个任务完整达到了预期目标，那么 Task Success Rate 就是 85%。

关键是要提前定义什么叫“成功”，比如对于订单 Agent，可能要求正确识别订单、正确调用工具、订单状态最终变成目标状态，并且正确回复用户。只有达到这些成功条件，才算任务完成。

> ### 注意一个面试细节
>
> **不是“回答正确率”。**
>
> Agent 的目标是：
>
> > **把事情办成。**
>
> 所以 Agent 最后说得很漂亮，但是订单实际上没有取消：
>
> > ❌ Task Success



### 如何设计端到端 Agent 测试用例？

> 不要只测 Agent “回答对不对”，而是从**用户提问开始，一直到任务真正完成**全部测试。

我会先定义用户的真实任务和成功标准，然后设计正常、异常、边界和多轮场景。

比如订单 Agent，不仅测试正常取消订单，还要测试订单不存在、订单已经发货、用户没有权限、Tool 超时以及用户中途修改需求等情况。

执行测试时，从用户输入开始完整跑一遍 Agent，同时检查最终结果、Tool 调用、参数、执行轨迹和异常处理。



### 如何模拟真实用户与 Agent 的交互？

我会先根据真实用户场景设计多轮交互，覆盖用户信息不完整、表达模糊、中途修改需求、输入错误以及连续追问等情况。

也可以让另一个 LLM 模拟用户，根据 Agent 当前的回复动态生成下一轮输入，让整个交互更加接近真实用户。

最后看 Agent 能不能持续理解用户意图，并最终完成任务。



### ⭐️ Agent 的成功率下降了，怎么定位问题？

如果 Agent 成功率下降，我会先和之前的版本做对比，确认是整体下降还是某一类任务下降。

然后根据 Agent 的执行链路逐层排查，比如：

1. 用户意图识别有没有问题；
2. Prompt 或模型输出有没有变化；
3. Tool 选择和参数有没有错误；
4. Tool 本身有没有报错；
5. Agent 执行流程有没有出现循环或者走错分支；
6. 最终结果生成有没有问题。

同时结合 Trace 和日志定位具体失败案例，最后通过 Evaluation Dataset 复现问题。



### 如何做 Agent 的回归测试？

> 意思是以前能做对的事情，改完之后不能做错。

我会建立一套固定的 Agent Evaluation Dataset，里面包含正常、异常、边界和历史上出现过的问题。

每次修改 Prompt、模型、Tool 或 Workflow 后，都重新跑这套测试集，然后对比修改前后的 Task Success Rate。

如果发现某些原来成功的 Case 现在失败，就说明出现了回归，需要进一步定位。

对于比较重要的 Agent，可以把这套测试接入 CI/CD，在代码或者 Prompt 更新后自动执行。



### 如何构建 Agent Evaluation Dataset？

> 把真实用户可能问的问题，整理成一套标准考试题。
>
> 每道题不仅有问题，还要有“正确答案/成功标准”。

我会优先从真实业务和线上用户场景中收集数据，然后进行分类和清洗。

测试集至少需要覆盖正常场景、异常场景、边界场景、多轮场景以及历史失败案例。

每条数据除了用户输入，还需要定义任务目标和成功标准，必要的时候还可以定义预期 Tool、参数或者最终状态。

最后把这些数据沉淀下来，作为 Agent 后续迭代和回归测试的基础。



### 离线评测和线上评测有什么区别？

离线评测主要用于开发和迭代阶段，通过固定 Evaluation Dataset 对不同版本进行可重复的对比；线上评测则基于真实用户和真实业务数据，更能反映实际效果。

所以我会用**离线评测保证版本质量，线上评测验证真实业务效果**，两者结合形成闭环。



### 如何评估 Agent 的稳定性？

> 意思是：同样的问题，多跑几次，能不能一直表现差不多。

我会通过重复执行相同测试用例，观察 Agent 输出和执行结果的一致性。

主要关注 Task Success Rate 的波动、Tool Calling 是否稳定、执行步骤是否出现随机变化，以及延迟和 Token 消耗是否异常。

对一些关键任务，可以进行多次重复测试，统计成功率和结果波动。如果同一个 Case 有时候成功、有时候失败，就需要重点排查模型随机性、Prompt、Tool 或上下文等因素。



### 如何评估 Agent 的鲁棒性？

> 意思是：同样的问题重复跑，结果稳不稳。换一种说法、加点干扰、遇到异常，还能不能完成任务。

鲁棒性主要看 Agent 遇到输入变化或者异常情况时，是否还能完成任务。

我会在正常测试集的基础上增加一些扰动，比如用户改写问题、错别字、信息缺失、冗余信息、上下文干扰以及 Tool 异常等，然后比较扰动前后的 Task Success Rate。

如果加入这些干扰后成功率下降很少，说明 Agent 的鲁棒性比较好。



## 二、LLM / Judge 评估

### 前言

你已经问到了 LLM-as-a-Judge，后面很容易继续追问：

1. **什么是 LLM-as-a-Judge？**
2. **LLM-as-a-Judge 有什么优缺点？**
3. **如何设计 Judge Prompt？**
4. **如何提高 Judge 的可靠性？**
5. **为什么不能完全相信 LLM Judge？**
6. **LLM Judge 和人工评估怎么结合？**
7. **Pointwise 和 Pairwise Evaluation 是什么？**
8. **如何比较两个 Agent 哪个效果更好？**
9. **Judge 模型应该选择什么模型？**
10. **如何避免 Judge 偏向某一种回答？**

尤其是：

> **“两个 Agent 哪个更好，你怎么评估？”**

很容易出现。



### 什么是 LLM-as-a-Judge？

> 让一个 LLM 当裁判，去评价 Agent 的回答好不好。

LLM-as-a-Judge 就是使用一个 LLM 作为评测器，根据预先定义的评价标准，对另一个 LLM 或 Agent 的输出进行评分。

比如可以让 Judge 从正确性、相关性、完整性等维度评价 Agent 的回答。

它比较适合开放式任务，因为这类任务通常没有唯一的标准答案，很难通过简单的规则判断。



### LLM-as-a-Judge 有什么优缺点？

优点是自动化程度高、效率高，而且比较适合开放式任务，可以大规模评估。

缺点是 Judge 本身也可能存在错误和偏差，比如偏好某种表达方式、对答案长度敏感，而且不同模型或者 Prompt 可能产生不同评分，同时也会带来额外的模型调用成本。

所以一般不会完全依赖 LLM Judge，而是结合规则评估和人工抽样。



### 如何设计 Judge Prompt？

我设计 Judge Prompt 时会尽量把评价标准明确化，包括任务描述、用户输入、Agent 输出、评分维度和具体评分标准。

对于关键任务，我还会给出一些正例和反例，让 Judge 更清楚什么情况下应该给高分或者低分。

最终最好要求结构化输出，方便程序自动统计。



### 如何提高 Judge 的可靠性？

提高 Judge 可靠性，我会从评价标准、Prompt、模型和结果校准几个方面入手。首先明确评分标准和评分等级，必要时加入正反例；其次要求结构化输出并给出评分理由；对于重要任务可以多次评估或者使用多个 Judge；最后抽样和人工结果进行对比，验证 Judge 和人工的一致性。



### 为什么不能完全相信 LLM Judge？

因为 LLM Judge 本身也是一个模型，它可能受到答案长度、表达方式、模型风格等因素影响，而且 Judge 自己也可能存在事实判断错误。

所以 LLM Judge 更适合作为一种自动化评估手段，而不是绝对的 Ground Truth。

实际项目中一般会结合规则评估、人工抽样以及多个评估指标进行校验。



### LLM Judge 和人工评估怎么结合？

我一般会采用“自动评估为主、人工抽样校验”的方式。

比如先让 LLM Judge 批量评估一万条数据，再从高分、低分以及 Judge 不确定的结果中进行人工抽样。

同时比较 Judge 和人工评分的一致性，如果发现某类任务差异比较大，就调整 Judge Prompt 或评分标准。

最终形成一个自动评估和人工评估相互校准的闭环。



### Pointwise 和 Pairwise Evaluation 是什么？

Pointwise 是对单个回答独立评分，比如从 1 到 5 分评价回答质量；Pairwise 则是把两个回答放在一起，让 Judge 判断哪个更好。

如果我要评估一个 Agent 本身的质量，可以使用 Pointwise；如果我要比较两个模型、两个 Prompt 或两个 Agent 的效果，Pairwise 通常更加直观。



### 如何比较两个 Agent 哪个效果更好？

如果比较两个 Agent，我会让它们在同一套 Evaluation Dataset 上执行，保证输入和测试条件一致。

然后从 Task Success、Correctness、Tool Calling、Latency、Token Cost 等维度进行比较。

对开放式结果，可以使用 Pairwise LLM Judge，让 Judge 直接比较两个 Agent 的回答哪个更好；对于明确任务，可以直接通过程序判断。

最后根据业务目标选择核心指标，而不是只看单一分数。



### Judge 模型应该选择什么模型？

udge 模型一般会根据任务复杂度、评估准确性和成本来选择。对于复杂任务，我会优先选择能力更强、评测表现更稳定的模型；对于大规模简单评测，可以选择成本更低的模型。

如果是关键业务，我还会通过人工标注数据验证 Judge 和人工评分的一致性，而不是只看模型本身的能力。



### 如何避免 Judge 偏向某一种回答？

为了减少 Judge Bias，我会尽量让评价过程和模型身份解耦，比如不告诉 Judge 回答来自哪个模型，同时随机交换两个回答的顺序，避免位置偏差。

另外明确评价标准，只让 Judge 根据任务完成度、正确性、相关性等客观指标进行判断。对于关键评测，可以多次评估或者使用多个 Judge，最后再通过人工抽样进行校准。



## 三、RAG Evaluation

### 前言

因为你简历里有 RAG，这部分**非常容易被问**。

1. **如何评估 RAG 效果？**
2. **Recall、Precision、Hit@K 是什么？**
3. **Context Precision / Context Recall 是什么？**
4. **Answer Relevancy 是什么？**
5. **Faithfulness / Groundedness 是什么？**
6. **如何判断 RAG 有没有幻觉？**
7. **如何评估 RAG 的召回效果？**
8. **如何评估 Rerank 效果？**
9. **RAG 检索到了正确文档，但回答还是错了，怎么排查？**
10. **如何构建 RAG Evaluation Dataset？**
11. **如何评估 Hybrid Search？**
12. **RAG 的离线评测和线上评测怎么做？**





### 如何评估 RAG 效果？

> 有没有找到正确的资料 → 找到的资料好不好 → 最后回答有没有根据资料正确回答。

我一般会从检索和生成两个部分来评估 RAG。

检索侧主要看召回效果，比如 Recall、Precision、Hit@K，以及 Context Precision 和 Context Recall，判断有没有把正确的文档召回。

生成侧主要看最终答案的相关性、正确性以及是否基于检索到的上下文，比如 Answer Relevancy 和 Faithfulness。

最后再结合端到端的任务完成率，判断整个 RAG 系统实际效果。



### ⭐️Recall、Precision、Hit@K 是什么？

Recall：该找的资料，我找到了多少？

Precision：我找回来的这些资料，有多少是真的有用？

Hit@K：前 K 个结果里，有没有至少一个正确答案？

| 指标            | 大白话                        | 主要看什么         |
| --------------- | ----------------------------- | ------------------ |
| **Recall@K**    | 该找的资料，找回来多少        | 召回覆盖率         |
| **Precision@K** | 找回来的资料，有多少是对的    | 召回准确性         |
| **Hit@K**       | 前 K 个里有没有至少一个正确的 | 有没有命中         |
| **MRR@K**       | 第一个正确答案排得靠不靠前    | 首个正确结果排名   |
| **NDCG@K**      | 越相关的结果是不是排得越前    | 整体排序质量       |
| **MAP@K**       | 多个相关结果的排序整体好不好  | 多个相关文档的排序 |



### Context Precision / Context Recall 是什么？

> 站在 RAG 最终回答的角度，判断检索出来的 Context 到底好不好。

Context Recall：回答这个问题需要的信息，我有没有都找回来？

Context Precision：我找回来的内容，有多少是真正有用的？



### Answer Relevancy 是什么？

> Agent 的回答是不是在回答用户的问题。

Answer Relevancy 主要评估最终答案和用户问题的相关程度，也就是 Agent 有没有真正回答用户的问题。

它关注的是“答没答到点上”，而不是单纯判断事实是否正确。



### Faithfulness / Groundedness 是什么？

> Agent 说的话，是不是能在 RAG 找到的资料里找到依据。

Faithfulness 或 Groundedness 主要评估最终回答是否有检索上下文作为依据，也就是回答中的关键事实能不能在 Context 中找到支持。

它主要用于判断 RAG 有没有出现“脱离检索内容自己编”的情况。



### 如何判断 RAG 有没有幻觉？

我会主要从 Groundedness 或 Faithfulness 的角度判断。把用户问题、检索到的 Context 和最终答案一起交给评估器，检查答案中的关键事实是否都能够被 Context 支持。

对明确的事实可以通过规则或者关键词判断，对复杂答案可以使用 LLM-as-a-Judge。

同时要注意，**Context 本身如果就是错的，Faithfulness 高也不代表最终答案一定正确**，所以最好还需要结合 Ground Truth 或人工评估。



### 如何评估 RAG 的召回效果？

> 先别看 LLM 回答，单独看 Retriever。

评估召回效果时，我会把 Retriever 和后面的 LLM 解耦，先准备带有 Ground Truth 的 Query-Document 数据集，然后只评估 Retriever。

主要指标可以使用 Recall@K、Precision@K、Hit@K，以及 MRR、NDCG 等排序指标，观察正确文档有没有被召回，以及排在什么位置。



**Retriever 就是 RAG 里面负责“找资料”的那一部分。**

大白话：

> 用户问问题 → Retriever 去知识库里找相关内容 → 把找到的内容交给 LLM → LLM 根据这些内容回答。



### 如何评估 Rerank 效果？

> Rerank = 看正确文档有没有排得更前。

Rerank 的核心是改善排序，所以我会固定 Retriever 的召回结果，然后分别计算 Rerank 前后的 Hit@K、MRR、NDCG 等指标，重点看相关文档的排名有没有提升。

如果 Rerank 后正确文档更容易出现在 Top K，说明 Rerank 有效果。



### ⭐️RAG 检索到了正确文档，但回答还是错了，怎么排查？

如果检索已经正确，但最终答案还是错误，我会把问题定位到 Retrieval 之后的链路。

首先检查 Chunk 是否完整，确认关键内容有没有被切断；然后检查 Context 是否正确传给 LLM，以及有没有被无关内容干扰；接着检查 Prompt 是否明确要求基于 Context 回答。

如果这些都没问题，再判断是不是模型本身理解或者生成出现错误。如果存在多个文档信息冲突，还需要检查文档版本和排序策略。



### 如何构建 RAG Evaluation Dataset？

RAG Evaluation Dataset 一般包含 Query、Ground Truth Context 或 Document，以及 Ground Truth Answer。

数据来源可以结合真实用户问题、人工构造的问题以及历史失败案例。

这样既可以单独评估 Retriever 的召回效果，也可以评估最终答案的正确性和 Faithfulness。



### 如何评估 Hybrid Search？

Hybrid Search 我会先分别评估 BM25 和向量检索，再评估融合后的结果，通过相同 Evaluation Dataset 比较 Recall@K、Hit@K、MRR、NDCG 等指标。

同时会针对不同类型的 Query 做分析，比如精确关键词、专业术语和语义型问题，判断 Hybrid Search 是否真正发挥了两种检索方式互补的优势。



### RAG 的离线评测和线上评测怎么做？

离线评测主要基于固定的 RAG Evaluation Dataset，用来比较不同 Chunking、Embedding、Retriever、Reranker 或 Prompt 方案的效果。

线上评测则基于真实用户请求，关注实际的用户满意度、任务完成率、追问率、错误率、延迟和成本等指标。

所以一般是**离线评测负责研发迭代，线上评测负责验证真实业务效果**。



## 四、Tool Calling / Agent 轨迹

### 前言

这部分对 **Agent 岗位**尤其重要。

1. **工具调用准确率如何量化？**
2. **如何评估 Tool Selection？**
3. **如何评估 Tool Arguments？**
4. **如何评估 Tool Calling 的成功率？**
5. **Agent 调用了错误的 Tool 怎么排查？**
6. **Agent 为什么会出现 Tool Calling Loop？**
7. **如何评估 Agent 的执行轨迹？**
8. **什么样的 Agent Trajectory 算合理？**
9. **如何评估 Agent 是否调用了不必要的 Tool？**
10. **如何评估 Agent 的规划能力？**
11. **如何评估 Agent 的错误恢复能力？**
12. **Tool 返回错误时，怎么评估 Agent 是否正确处理？**



### 工具调用准确率如何量化？

> 选对 → 参数对 → 执行成功 → 任务完成

我会把工具调用拆成 Tool Selection、Tool Arguments 和 Tool Execution 三部分分别评估。

Selection 看工具有没有选对，Arguments 看参数是否正确，Execution 看工具有没有成功执行。

同时还会关注 Tool Calling 对最终 Task Success 的贡献，避免只看工具调用成功，但实际上没有完成任务。



### 如何评估 Tool Selection？

> Agent 有没有选对工具。

我会准备带有 Ground Truth Tool 的测试集，然后比较 Agent 实际选择的 Tool 和预期 Tool 是否一致。

对于存在多个工具都可以完成任务的情况，可以定义多个合法 Tool，不能简单地认为只有一个正确答案。



### 如何评估 Tool Arguments？

> 工具选对了，但是参数有没有传对？

Tool Arguments 我会和预期参数进行对比，分别检查参数是否缺失、参数名是否正确、类型是否正确以及具体值是否正确。

对于结构化参数，可以直接通过 Schema 和程序进行自动校验；对于参数值需要结合上下文判断的情况，再进行语义评估。



### 如何评估 Tool Calling 的成功率？

> 工具真正执行成功了吗？

Tool 执行成功 ≠ Agent 任务成功。



### Agent 调用了错误的 Tool 怎么排查？

我会先看 Agent 当时的完整 Trace，确认用户意图和 Tool Description 是否匹配。

然后检查 Tool Schema、Prompt 以及是否存在多个功能重叠的 Tool。

如果这些都没有问题，再通过 Evaluation Dataset 大量复现，判断是系统设计问题还是模型本身的决策问题。

**Trace（追踪）** 可以简单理解为：

> **一次 Agent 执行过程的完整记录。**





### Agent 为什么会出现 Tool Calling Loop？

> Agent 一直重复调用 Tool，不知道什么时候应该停。

Tool Calling Loop 一般需要结合 Trace 排查。我会重点看 Agent 为什么在每一轮都认为还需要继续调用 Tool。

常见原因包括结束条件不明确、Tool 返回结果无法满足 Agent 判断、Prompt 或 Workflow 条件错误，以及 Tool 本身功能设计不合理。

工程上还可以增加最大循环次数、重复 Tool 检测等保护机制。



### 如何评估 Agent 的执行轨迹？

> 我会把 Agent 每一步的 LLM Decision、Tool Call、Tool Result 和最终输出记录下来，然后从工具选择、参数、调用顺序、重复调用、异常处理以及最终任务完成情况几个维度评估。
>
> 对明确流程可以通过规则判断，对复杂轨迹可以使用 LLM Judge 或人工抽样。



### 什么样的 Agent Trajectory 算合理？

> 合理的轨迹不是：步骤越少越好。而是：用合理的最少步骤完成任务。

合理的 Agent Trajectory 应该能够围绕任务目标，选择正确的工具和参数，并按照合理的顺序执行，同时避免无意义的重复调用。

如果遇到异常，也应该能够根据 Tool 返回结果调整后续策略，而不是重复执行相同操作或者进入循环。



### 如何评估 Agent 是否调用了不必要的 Tool？

我会针对测试任务定义 Expected Tool Calls，然后和 Agent 实际的 Tool Calls 进行对比。

如果 Agent 调用了与任务无关的工具，或者重复调用已经获得结果的工具，就可以认为存在不必要调用。

同时还会关注额外调用带来的 Latency 和 Token Cost。



### 如何评估 Agent 的规划能力？

我会把复杂任务拆成多个子目标，然后评估 Agent 是否识别出了必要步骤，以及步骤之间的依赖关系是否正确。

同时关注执行过程中是否遗漏关键步骤、产生不必要步骤，以及遇到 Tool 返回异常或者用户修改需求后能不能动态调整计划。

最终还是要结合 Task Success 和 Trajectory 一起评估，而不是单独评价规划文本。



### 如何评估 Agent 的错误恢复能力？

我会主动注入各种 Tool 异常，比如 Timeout、参数错误、空结果、权限错误等，然后观察 Agent 能不能识别错误原因，并采取合理的恢复策略。

最终可以统计 Error Recovery Rate，也就是发生错误后最终成功恢复并完成任务的比例。



### Tool 返回错误时，怎么评估 Agent 是否正确处理？

我会针对不同类型的 Tool Error 构造测试用例，然后检查 Agent 是否正确识别错误、理解错误原因，并采取合理的恢复策略。

比如订单已经发货时，Agent 不应该重复调用取消订单，而应该理解 Tool 返回的业务错误，并把结果反馈给用户。

最终可以统计错误处理成功率和 Error Recovery Rate。



## 五、多轮对话 / Memory Evaluation

### 前言

你简历里有 **Memory、Summarization**，所以也建议准备。

1. **多轮对话中的上下文一致性如何评估？**
2. **如何评估 Agent 的记忆能力？**
3. **短期记忆和长期记忆怎么评估？**
4. **Memory Recall 怎么评估？**
5. **如何判断 Agent 是否记住了关键信息？**
6. **上下文压缩 / Summary 后信息丢失怎么评估？**
7. **如何评估多轮对话中的指代消解？**
8. **用户修改信息后，Agent 如何保证状态一致？**
9. **长上下文场景怎么测试？**
10. **如何测试 Memory 污染 / 错误记忆？**



### 多轮对话中的上下文一致性如何评估？

> 前面说过的话，后面还能不能正确接上。

我会设计多轮对话测试集，在不同轮次中重复引用、修改和组合之前的信息，然后检查 Agent 是否能够保持状态一致。

主要关注信息记忆、上下文引用、前后回答一致性，以及用户修改信息后状态是否正确更新。



### 如何评估 Agent 的记忆能力？

> Agent 有没有记住应该记住的信息。

我会构造不同难度的 Memory Recall Case，包括即时回忆、多轮之后回忆、长上下文之后回忆，以及跨 Session 回忆，然后计算 Memory Recall Rate，判断 Agent 能否正确找回需要的信息。



### 短期记忆和长期记忆怎么评估？

短期记忆主要测试同一 Session 内的信息保持能力，例如跨多轮对话的信息引用；长期记忆则需要跨 Session 测试，验证之前保存的信息能不能在后续会话中正确召回。

两者都可以通过 Memory Recall Rate、信息准确率以及错误记忆率进行评估。



### Memory Recall 怎么评估？

> 需要记忆的信息，Agent 找回来了多少？



### 如何判断 Agent 是否记住了关键信息？

我会先定义 Memory Schema 或关键记忆项，而不是要求 Agent 记住所有上下文。然后通过多轮对话把关键信息埋在上下文中，再在后续对话中主动触发这些信息，检查 Agent 能否正确召回和使用。

同时还要检查 Agent 有没有把不应该长期记忆的信息错误保存下来。



### ⭐️上下文压缩 / Summary 后信息丢失怎么评估？

我会先从原始对话中标注关键事实，然后进行 Summary 或 Context Compression，再通过后续问题测试这些关键事实是否还能被正确召回。

可以计算压缩前后的 Memory Recall 或 Critical Fact Recall，同时关注压缩后的事实是否发生改变。



### 如何评估多轮对话中的指代消解？



### 用户修改信息后，Agent 如何保证状态一致？

我会设计状态更新场景，例如用户先提供一个信息，后续主动修改，再检查 Agent 后续是否始终使用最新状态。

对于结构化信息，可以通过 State 或 Memory Store 直接校验最终状态；对于自然语言记忆，可以通过后续问答验证。



### 长上下文场景怎么测试？

长上下文测试我会控制 Context Length、关键信息位置以及干扰信息数量，然后测试 Agent 对关键事实的 Recall。

比如分别把关键信息放在开头、中间和结尾，并逐步增加无关上下文，观察随着上下文长度增加，Memory Recall 和任务成功率是否下降。



### 如何测试 Memory 污染 / 错误记忆？

我会专门构造错误信息、过期信息、临时信息以及用户主动纠正信息的测试 Case，然后检查 Memory Store 中最终保存的内容。

重点评估错误信息有没有被写入、旧信息有没有正确失效，以及新信息能不能覆盖旧信息。

同时可以统计 Memory Pollution Rate 和 Memory Update Accuracy。



## 六、线上 Evaluation

### 前言

这个是很多候选人容易忽略的。

面试官可能问：

> **“你的 Agent 上线之后，怎么知道它效果变好了还是变差了？”**

可以准备：

1. **线上 Agent 怎么评估？**
2. **线上核心指标有哪些？**
3. **如何监控 Agent Task Success Rate？**
4. **如何发现线上 Agent 出现异常？**
5. **如何做 Agent A/B Test？**
6. **如何评估用户满意度？**
7. **如何评估 Agent 的成本？**
8. **如何评估 Agent 的延迟？**
9. **如何发现 Prompt 更新导致效果下降？**
10. **如何建立线上 + 离线 Evaluation 闭环？**





### 线上 Agent 怎么评估？

> 线上不能只看：
>
> > “LLM 返回了什么。”
>
> 而是要看真实用户使用后的整体效果。

线上评估我会从 **效果、稳定性、性能、成本和用户体验**几个维度进行。

效果上关注 Task Success Rate、用户满意度和错误率；稳定性关注 Tool Error、Timeout 和整体 Error Rate；性能关注平均延迟以及 P95、P99；成本关注 Token 消耗和单次任务成本。

同时通过 Agent Trace 保留完整执行轨迹，方便出现问题后定位原因。



### 线上核心指标有哪些？

我一般会把线上指标分成效果、稳定性、性能、成本和用户体验五类。核心指标包括 Task Success Rate、Error Rate、Latency、Token Cost、用户满意度以及追问率等。



### 如何监控 Agent Task Success Rate？

线上 Task Success Rate 我会尽量优先使用业务状态或者规则自动判断，比如订单是否创建成功、退款是否完成。

对于没有明确业务状态的开放式任务，可以通过 LLM Judge 对最终回答和执行轨迹进行评估。

然后按小时、天或者版本统计 Task Success Rate，并进行趋势监控和异常告警。



### 如何发现线上 Agent 出现异常？

我会先通过核心指标设置监控和告警，例如 Task Success Rate、Error Rate、P95 Latency、Tool Failure Rate 和 Token Cost。

一旦出现异常，通过 Agent Trace 查看具体请求的 LLM 调用、Tool Calling、参数、返回结果以及执行耗时，进一步定位是模型、Prompt、Tool 还是 Workflow 的问题。



### 如何做 Agent A/B Test？

> 一部分用户用旧版本，一部分用户用新版本，然后比较效果。

A/B Test 会随机把真实流量分成 A、B 两组，保证两组用户和测试条件尽可能一致，只改变一个核心变量，比如 Prompt、Model 或 Workflow。

然后比较 Task Success、用户满意度、Latency、Cost、Error Rate 等指标，并观察结果是否具有统计意义。



### 如何评估用户满意度？

用户满意度可以结合显式和隐式反馈。显式反馈包括点赞、点踩和评分；隐式反馈可以观察追问率、重复提问率、中断率和人工转接率。

最好不要依赖单一指标，而是综合判断。



### 如何评估 Agent 的成本？

Agent 成本主要来自 LLM Token、Embedding、Rerank、Tool/API 和基础设施。我会重点统计单任务成本、Token Usage、LLM 调用次数和 Tool 调用次数。

对 Agent 特别需要关注循环调用和无效 Tool Calling，因为它们很容易造成成本异常增长。



### 如何评估 Agent 的延迟？

> P50、P95、P99 是百分位延迟指标。P50 表示 50% 的请求延迟低于该值，代表典型性能；P95 表示 95% 的请求低于该值，用来衡量大多数用户的体验；P99 表示 99% 的请求低于该值，主要用来发现尾部延迟问题。在线上 Agent 中，我通常会结合 Trace 分析 P95/P99 慢请求，定位到底是 LLM、RAG、Tool Calling 还是其他环节导致的延迟。

Agent 延迟不能只看平均值，我会重点关注 P50、P95、P99，并通过 Trace 把总耗时拆成 LLM、Retriever、Reranker、Tool 等环节，定位具体瓶颈。

对 Agent 来说还需要关注 LLM 调用次数和 Tool 调用次数，因为多轮调用会直接增加整体延迟。



### 如何发现 Prompt 更新导致效果下降？

Prompt 修改后，我会先跑离线 Evaluation Dataset 做回归测试，如果核心指标明显下降就阻止上线。

如果离线测试通过，再通过小流量 A/B Test 观察线上 Task Success、用户满意度、Error Rate、Latency 和 Cost。

如果线上指标下降，再结合 Trace 做 Case 分析，定位具体是 Tool Selection、参数、推理过程还是最终回答出了问题。



### ⭐️如何建立线上 + 离线 Evaluation 闭环？

                线上真实流量
                     ↓
              Agent Observability
                     ↓
            收集 Trace / Feedback
                     ↓
              发现 Bad Case
                     ↓
           加入 Evaluation Dataset
                     ↓
              离线 Regression
                     ↓
          Prompt / Model / Workflow
                   优化
                     ↓
               A/B Test
                     ↓
                灰度上线
                     ↓
               线上监控
                     ↓
                新 Bad Case
                     ↺

















