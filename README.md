# SJTU-Bench · 交大校园 AI 任务集

> **交大校园任务挑战**：16 个真实校园目标，看看Agent能如何帮助你的交大生活！
> **非正经科研**，是娱乐 + 启发，如果这项“工作”能对大家使用AI提升效率有一点微小的启发，是我莫大的荣幸！**任何能操作浏览器/本机文件的 agent 都能跑**

**⚠️ 隐私说明 [PRIVACY.md](PRIVACY.md)：账号、邮件、课表、发票等数据永远只在本机；排行榜只接受你主动上传的匿名汇总数字。**

## 特别致谢

感谢水源 **@Milvoid** 的[《分享个人信息基建和 Agent 设定》](https://shuiyuan.sjtu.edu.cn/t/topic/476017)：其中"只读数据通道 / CLI 化 / 常驻 agent + 消息桥"的思路，直接启发了本 bench 的 Build 阶段和 L4-03 任务，也是我们后续把微信本地公众号 CLI 接进自己工具链的灵感来源。强烈推荐原帖。

## 为什么不是"又一个意义不明的 agent benchmark"

本Bench分为多个阶段：

1. **Cold run（裸跑）**：agent 只拿到任务目标，用自己已有的通用能力（浏览器、shell、文件、搜索）去试；每任务有**硬时限**，超时直接失败。
2. **Build（搭工作流）**：跑完一轮后，agent 自己发现哪些步骤又慢又重复，动手写脚本 / 自定义工具 / 浏览器自动化 / prompt 工作流。
3. **Warm run（复跑）**：用自己搭的工作流再跑同一批任务，对比 cold vs warm 的通过率和用时。

**时间预算**：每个任务的 `timeLimitSeconds = referenceSeconds × 1.5`，其中 `referenceSeconds` 是我们用成熟工具跑一遍的用时（写在任务 YAML 里）。超过时限 = 任务失败；这迫使 agent 感受"没有工作流有多慢"，也给出明确的优化目标。

排行榜展示：cold 通过/用时、warm 通过/用时，以及提升幅度。

## 16 个任务（L1–L4）

| 级别 | 定位 | 任务 |
|---|---|---|
| L1 | 单点查询 | 今日课表 / 教务通知 / 水源搜索 / 交我办服务 |
| L2 | 跨源整理 | 一周 DDL / 公众号文章 / 邮箱搜索 / 活动筛选 |
| L3 | 多步流程 | 跨源政策核对 / 云盘查找 / 报销流程（预填） / 交我办办事规划 |
| L4 | 综合与设计 | 今日校园简报 / 关键词订阅工作流 / 个人 Agent 配置建议（含社区案例） / 课程回放 → ASR → 笔记 |

> L4「课程回放 → ASR → 笔记」的需求来自水源用户 **@Spirit的magixx本人** 在 [本 bench 帖第 28 楼](https://shuiyuan.sjtu.edu.cn/t/topic/526426/28) 的反馈，特此注明出处。

完整定义见 [tasks/](tasks/)，评分见 [SCORING.md](SCORING.md)，参与协议见 **[PROTOCOL.md](PROTOCOL.md)**。

## 实时排行榜

> 排名按 **cold → warm 节省的时间** 降序；只展示用户主动上传的匿名汇总数据（无账号、无内容、无截图）。
> 提交方式见 [leaderboard/README.md](leaderboard/README.md)。

<!-- LEADERBOARD:START -->
| # | Agent | Cold 通过 | Cold 用时 | Warm 通过 | Warm 用时 | 提速 | 日期 |
|---|-------|-----------|-----------|-----------|-----------|------|------|
| — | 暂无提交，等你来 | — | — | — | — | — | — |
<!-- LEADERBOARD:END -->

### 单轮成绩（v1 兼容）

> cold/warm 改版前的单轮提交，按净节省时间排序；只作历史记录，不再接受新的 v1 提交。

<!-- LEGACY_LEADERBOARD:START -->
| # | Agent | 得分 | 通过 | 用时 | 净节省 | 日期 |
|---|-------|------|------|------|--------|------|
| 1 | Claude Code (Opus 5.5) + sjtu-mcp | 79.1 | 13/15 | 1120s | 4400s | 2026-10-19 |
<!-- LEGACY_LEADERBOARD:END -->

## 快速开始（任意 agent）

**除你自己的 jAccount 登录外，不需要提前安装/配置/搭建任何东西。**

> **唯一前提**：你本人有 jAccount，并且已在**你自己的浏览器**里登录。这是读取你课表/邮件/云盘/报销等个人数据所必需的。

你只需要：

1. 直接把仓库链接发给它；
2. agent 按协议先跑 **cold run**：逐任务计时，超过 `timeLimitSeconds` 就记失败；
3. 跑完后 agent 自己总结卡点、搭建工作流；
4. 用同一个 agent + 新工作流跑 **warm run**；
5. 每轮用 LLM judge 本地评分，汇总 cold/warm 成绩；
6. 可选：生成匿名汇总提交到排行榜。
7. 后续：根据你自己的偏好，搭建自己的交大助手！
8. 建议：如果有好的任务idea，欢迎贡献PR，让大家惊叹“原来有人对交大开发到了这个程度”

> 再次提醒：登录由你本人在 Chrome 完成，**不要把 Cookie 或密码交给 agent**。

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
