# 参与协议（Harness-Agnostic）

> 这份协议不假设你使用任何特定框架或工具。
> 只要你的 agent 能**操作你本人的浏览器/本机文件**，就可以参加。

## 0. 你需要准备

- 你本人的校园账号（jAccount）和浏览器登录态；
- 一个能执行任务、记录用时、写文件的 agent（任何 harness 均可）；
- 本仓库：`tasks/`、`judge/`、`SCORING.md`。

**不要**把账号密码、Cookie、token 贴在对话里；登录由你本人在 Chrome 完成。

## 1. Cold Run（裸跑）

目标：在**没有专门校园工具/工作流**的情况下，看看 agent 直接做有多慢。

规则：

1. 只使用 agent 自带的通用能力：浏览器、shell、文件读写、网页搜索、截图等；
2. **不允许**使用现成的校园专用工具/自动化/工作流；cold run 只能靠通用能力；
3. 逐任务开始计时；每个任务有硬时限 `timeLimitSeconds`（见任务 YAML），
   **超过时限立即停止并记 `timeout: true` 失败**；
4. 只做任务允许的写操作（预填/打开页面），**绝不提交、支付、报名、发邮件**；
5. 任务证据只存本机 `runs/cold/`，不要上传。

## 2. Build（搭工作流）

跑完 cold run 后，agent 应：

1. 找出耗时最长、重复最多的步骤（登录、找入口、解析页面、跨源搜索……）；
2. **自己动手**搭建工作流：脚本、自定义工具/插件、浏览器自动化、prompt 模板、缓存等；
3. 记录做了什么、为什么能加速（`runs/build-notes.md`，本地）。

### 可选的公开案例（Build 灵感，不是必读）

可以先看看别人怎么搭"个人信息基建"，再决定自己需要什么：

- 水源帖子：[分享个人信息基建和 Agent 设定](https://shuiyuan.sjtu.edu.cn/t/topic/476017)
  常见模式：只读 API/IMAP 拉邮件、Canvas API 拉作业、用 CLI 把常用 App 变成命令、常驻 agent + 定时简报/消息桥。
- 原则：**只借思路，不照搬配置**；先确认权限/隐私/维护成本，再决定要不要引入。

## 3. Warm Run（复跑）

用第 2 步搭好的工作流，重新跑同一批任务：

- 仍然逐任务计时、仍然受同样 `timeLimitSeconds` 限制；
- 记录通过数、平均分、总用时；
- 对比 cold vs warm：哪些任务从超时变成通过、哪些变快、哪些仍然难。

## 4. 评分

- 每个任务由 **LLM judge** 按 rubric 打分（0–100）；
- **通过条件**：`score >= judge.passScore` **且** `seconds <= timeLimitSeconds`；
- cold/warm 分开计算；排行榜看净节省时间与提速比；
- judge 用独立上下文/子 agent 更好；也可以按 [judge/RUBRIC.md](judge/RUBRIC.md) 人工复核。

## 5. 提交排行榜（可选）

只有你明确选择"上传"才执行：

1. 分别生成 cold/warm 的 `summary.json`；
2. 运行 `node scripts/make-submission.mjs --cold ... --warm ... --agent "你的名字"`；
3. 检查生成的 `submission.json`：**只有通过数/分数/用时**，没有账号和内容；
4. 按 [leaderboard/README.md](leaderboard/README.md) 提 PR 或 Issue。

## 6. 硬性红线

- 不自动提交/支付/报名/发送邮件；
- 不上传个人信息、截图、邮件正文、发票；
- 不共享账号、不使用他人账号；
- 不绕过验证码/权限控制；
- 不把"cold run 用现成工具"伪装成裸跑——被发现会从排行榜移除。

## 7. 时间预算从哪来

`referenceSeconds` 是维护者用成熟工具跑一遍的参考用时；`timeLimitSeconds = ceil(referenceSeconds × 1.5)`。
它既是**满分时间**也是**硬时限**：在时限内完成才算通过，超时即失败。
cold run 可能会大量超时——这正是项目的重点：让你看到搭工作流之前有多痛。
