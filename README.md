# SJTU-Bench · 交大校园 AI 任务集

> **一个不依赖任何 agent harness 的校园任务挑战**：15 个真实校园目标，先让 agent 直接试、踩坑、超时，再自己搭工作流复跑，看效率到底能提升多少。
> 不是论文 benchmark，是娱乐 + 启发。**任何能操作浏览器/本机文件的 agent 都能跑，不需要提前装任何东西。**

**⚠️ 先看 [PRIVACY.md](PRIVACY.md)：账号、邮件、课表、发票等数据永远只在本机；排行榜只接受你主动上传的匿名汇总数字。**

## 为什么不是"又一个 agent benchmark"

大多数校园 benchmark 直接给 agent 一套现成工具，测的是"工具调用"；这个项目反过来：

1. **Cold run（裸跑）**：agent 只拿到任务目标，用自己已有的通用能力（浏览器、shell、文件、搜索）去试；每任务有**硬时限**，超时直接失败。
2. **Build（搭工作流）**：跑完一轮后，agent 自己发现哪些步骤又慢又重复，动手写脚本 / 自定义工具 / 浏览器自动化 / prompt 工作流。
3. **Warm run（复跑）**：用自己搭的工作流再跑同一批任务，对比 cold vs warm 的通过率和用时。

**时间预算**：每个任务的 `timeLimitSeconds = referenceSeconds × 1.5`，其中 `referenceSeconds` 是我们用成熟工具跑一遍的用时（写在任务 YAML 里）。超过时限 = 任务失败；这迫使 agent 感受"没有工作流有多慢"，也给出明确的优化目标。

排行榜展示：cold 通过/用时、warm 通过/用时，以及提升幅度。

## 15 个任务（L1–L4）

| 级别 | 定位 | 任务 |
|---|---|---|
| L1 | 单点查询 | 今日课表 / 教务通知 / 水源搜索 / 交我办服务 |
| L2 | 跨源整理 | 一周 DDL / 公众号文章 / 邮箱搜索 / 活动筛选 |
| L3 | 多步流程 | 跨源政策核对 / 云盘查找 / 报销流程（预填） / 交我办办事规划 |
| L4 | 综合与设计 | 今日校园简报 / 关键词订阅工作流 / 个人 Agent 配置建议 |

完整定义见 [tasks/](tasks/)，评分见 [SCORING.md](SCORING.md)，参与协议见 **[PROTOCOL.md](PROTOCOL.md)**。

## 实时排行榜

> 排名按 **cold → warm 节省的时间** 降序；只展示用户主动上传的匿名汇总数据（无账号、无内容、无截图）。
> 提交方式见 [leaderboard/README.md](leaderboard/README.md)。

<!-- LEADERBOARD:START -->
| # | Agent | Cold 通过 | Cold 用时 | Warm 通过 | Warm 用时 | 提速 | 日期 |
|---|-------|-----------|-----------|-----------|-----------|------|------|
| — | 暂无提交，等你来 | — | — | — | — | — | — |
<!-- LEADERBOARD:END -->

## 快速开始（任意 agent）

**除你自己的 jAccount 登录外，不需要提前安装/配置/搭建任何东西。**

> **唯一前提**：你本人有 jAccount，并且已在**你自己的浏览器**里登录。这是读取你课表/邮件/云盘/报销等个人数据所必需的，不是安装或配置——登录由你本人完成，密码和 Cookie 不交给 agent。

你只需要：

1. 把本仓库的 [PROTOCOL.md](PROTOCOL.md) 和 [tasks/](tasks/) 交给你的 agent（或直接把仓库链接发给它）；
2. agent 按协议先跑 **cold run**：逐任务计时，超过 `timeLimitSeconds` 就记失败；
3. 跑完后 agent 自己总结卡点、搭建工作流；
4. 用同一个 agent + 新工作流跑 **warm run**；
5. 每轮用 LLM judge 本地评分，汇总 cold/warm 成绩；
6. 可选：生成匿名汇总提交到排行榜。

> Agent 需要能操作你自己的浏览器/本机文件；登录由你本人在 Chrome 完成，**不要把 Cookie 或密码交给 agent**。

## 评分与排行

- 单任务通过 = LLM judge 分数 ≥ `judge.passScore` **且** 用时 ≤ `timeLimitSeconds`；
- cold/warm 各算：通过数、平均分、总用时；
- 排行榜按 `cold.elapsedSeconds - warm.elapsedSeconds`（净节省时间）排序，并列看提速比；
- 详细公式与 judge 规则：[SCORING.md](SCORING.md)、[judge/JUDGE_PROMPT.md](judge/JUDGE_PROMPT.md)。

## 隐私

- 无服务器、无遥测；任务证据只存本机 `runs/`；
- 排行榜只接受匿名汇总 JSON（cold/warm 的通过数、分数、用时），schema 拒绝额外字段；
- **不会上传**：账号、Cookie、课表、邮件、发票、截图、任务回答、IP；
- 详见 [PRIVACY.md](PRIVACY.md)。

## 参与贡献

- 新任务：按 `tasks/README.md` 格式提 PR（Issue 模板见 `.github/ISSUE_TEMPLATE/`）；
- 改协议、评分、脚本、文档都欢迎；
- 原则：只读优先、写操作只预填、绝不要求提交/支付/上传个人数据。

## License

MIT。非上海交通大学官方项目；请遵守学校系统与各平台使用条款。
