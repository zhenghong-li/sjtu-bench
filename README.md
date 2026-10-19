# SJTU-Bench · 交大校园 AI 任务集

> 用 AI 跑一遍你的校园生活：15 个真实校园信息化任务，L1→L4，登一次 jAccount 就能开跑。
> 不是论文 benchmark，是**娱乐 + 启发**：让更多同学第一次感受到"AI 真的能帮我办事"。

**⚠️ 先看这个：[PRIVACY.md](PRIVACY.md) —— 你的账号、邮件、课表、发票等数据永远不会离开本机；排行榜只接受你明确选择上传的匿名汇总分数。**

## 这是什么

把交大学生日常会用的校园系统（教务、交我办、水源、公众号、邮箱、云盘、ZIRC、报销）设计成 15 个任务：

- 每个任务有 **prompt + 允许工具 + LLM 评分标准 + 人工耗时基准**；
- 你的 agent（DSH / Claude Code / Codex / 任意带工具的 agent）按顺序执行；
- 完成后由 **LLM judge** 打分，汇总成"得分 / 用时 / 净节省时间"；
- 你可以选择：① 上传**匿名汇总成绩**到排行榜；② 让 agent 根据本次表现帮你搭一套自己的校园 Agent。

任务难度：

| 级别 | 定位 | 数量 |
|---|---|---|
| L1 | 单工具查询，2 分钟内完成 | 4 |
| L2 | 跨工具/跨源信息整理 | 4 |
| L3 | 多步操作 + 人工确认（预填，不提交） | 4 |
| L4 | 综合简报 / 工作流设计 / 个性化 Agent 方案 | 3 |

完整任务列表见 [tasks/](tasks/)，评分规则见 [SCORING.md](SCORING.md)。

## 实时排行榜

> 排名按"净节省时间"降序；仅展示**用户主动上传的匿名汇总数据**（无账号、无内容、无截图）。
> 提交方式见 [leaderboard/README.md](leaderboard/README.md)。

<!-- LEADERBOARD:START -->
| # | Agent | 得分 | 通过 | 用时 | 净节省 | 日期 |
|---|-------|------|------|------|--------|------|
| — | 暂无提交，等你来 | — | — | — | — | — |
<!-- LEADERBOARD:END -->

## 快速开始（DSH + sjtu-mcp）

> 需要：Node.js 24+、[DSH](https://github.com/deepseek-ai/deepseek-harness)、以及 [sjtu-mcp](https://github.com/zhenghong-li/SJTU-Agent)（校园 MCP server）。

1. 按 [SJTU-Agent](https://github.com/zhenghong-li/SJTU-Agent) 的 README 安装并注册 `sjtu-mcp`，在 DSH 中调用一次 `auth_login` 完成 jAccount 登录（只需一次，profile 持久化）。
2. 把本仓库的 [`skills/sjtubench`](skills/sjtubench/SKILL.md) 放进你的 DSH skills 目录（或直接把该文件链接丢给 agent）。
3. 对 agent 说：

   > 我要试一试 sjtubench

agent 会自动：检查登录态 → 按 L1→L4 跑 15 个任务 → 本地保存证据 → LLM judge 打分 → 输出成绩 → 询问你两个可选问题（上传匿名成绩 / 生成个人 Agent 配置建议）。

**任何其他 agent 也能跑**：把 [skills/sjtubench/SKILL.md](skills/sjtubench/SKILL.md) 和 [tasks/](tasks/) 交给它，并确保它有等价的校园工具（浏览器/MCP 均可）。

## 评分与排名

- 每个任务由 **LLM judge** 按 rubric 打 0–100 分，≥ 60 记为通过；
- `score` = 15 个任务的平均分（保留 1 位小数）；
- `timeSavedSeconds` = Σ(通过任务的"人工基准耗时") − agent 实际总用时；
- 排行榜：净节省时间高者在前；并列看平均分，再看用时；
- **这是娱乐榜**：LLM 评分有噪声、不同 agent 工具不同、网络有波动；请勿当作严谨评测或学术结论。

细节：[SCORING.md](SCORING.md)。

## 排行榜上传（可选，默认不上传）

跑完后 agent 会问你：

> 是否愿意上传匿名成绩到排行榜？（只包含分数、用时、级别通过数，不包含任何账号/内容/截图）

选择"是"才会生成 `submission.json`；你可以先打开检查，确认只含汇总数字后再按 [leaderboard/README.md](leaderboard/README.md) 提交 PR/Issue。**不选择则什么都不上传。**

## 个人 Agent 定制

跑完后 agent 还会问：

> 是否愿意根据本次 bench 表现和你的常用场景，生成一份"我的校园 Agent 配置建议"？

选择"是"会在**本地**生成一份建议（装哪些工具、哪些任务适合自动化、哪些需要人工确认），不会上传。

## 自建任务（Self-Bench）

想评测自己的特化任务？看 [self-bench/README.md](self-bench/README.md)：复制模板，写自己的 prompt/评分标准，在本地评分即可；**不进入主排行榜**。

## 参与贡献

- 新的校园任务：提 PR 到 `tasks/`（模板见 [.github/ISSUE_TEMPLATE/new-task.yml](.github/ISSUE_TEMPLATE/new-task.yml)）；
- 修正任务/评分标准、补充工具适配、改进文档都欢迎；
- 原则：**只读优先、写操作只预填、绝不要求提交/支付/上传个人数据**。

## 隐私承诺（摘要）

- 无服务器、无遥测、无隐藏上报；本仓库只是任务文件 + 脚本；
- 运行产生的证据（截图、邮件、课表等）全部留在本机 `runs/`，已被 `.gitignore` 排除；
- 只有你明确选择上传的**匿名汇总 JSON**才会进入仓库，schema 强制拒绝账号/内容字段；
- 详细说明与安全检查清单：[PRIVACY.md](PRIVACY.md)。

## License

MIT。非上海交通大学官方项目；请遵守学校系统与各平台使用条款。
