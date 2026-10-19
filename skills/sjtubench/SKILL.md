---
name: sjtubench
description: 运行 SJTU-Bench（15 个交大校园 AI 任务）：检查 sjtu-mcp 登录态、按 L1-L4 执行任务、本地 LLM judge 评分、汇总用时与净节省时间，并可选生成匿名排行榜提交和个人 Agent 配置建议。触发词：我要试一试 sjtubench / 跑一下 sjtu bench / 校园 bench。
---

# SJTU-Bench Runner

## 何时使用

用户说“我要试一试 sjtubench”“跑一下 sjtu bench”“测测我的校园 agent”时使用。
目标是**让用户以最小操作完成 15 个任务并看到结果**，不是追求高分或难倒 agent。

## 前置检查（只在这两种情况下打断用户）

1. **工具缺失**：如果当前会话没有以下任一工具（`timetable_get`、`notice_list`、`shuiyuan_search`、`mail_search` 等），说明需要先安装/注册
   [sjtu-mcp](https://github.com/zhenghong-li/SJTU-Agent)，并给出 README 链接；不要向用户索要 Cookie/密码。
2. **登录失效**：调用 `auth_status` / `auth_probe`；若未登录，调用 `auth_login` 打开 Chrome，请用户本人完成 jAccount 登录，然后重新探测。
   其他情况不要反复询问用户，自行继续。

## 准备

- 找到本仓库路径（包含 `tasks/`、`judge/`、`scripts/`）。默认 `~/sjtu-bench` 或用户指定目录；若不存在，询问用户克隆路径（不要自动 push/上传）。
- 读取 `tasks/*.yaml` 全部任务，按 `level` 再按 id 排序。
- 创建本地运行目录：`runs/<YYYYMMDD-HHmmss>-<4位随机>/`，并建 `evidence/`。
  **该目录只在本机；绝不 `git add`、绝不外传。**
- 读取 `judge/JUDGE_PROMPT.md` 与 `judge/RUBRIC.md`。

## 执行 15 个任务

对每个任务（L1 → L4）：

1. 告诉用户当前进度，例如“L1-01 今日课表（3/15）”，避免长静默。
2. 记开始时间；按 `prompt` 执行，只使用允许的只读/预填工具。
   - 只读任务：绝不提交/修改；
   - `safety: prefill` 任务：只能预填/打开页面，**绝不点击提交、支付、报名、发送**；
   - 若任务因个人数据缺失无法完成（如没有发票/邮件），记录实际情况，不要编造。
3. 把回答与工具调用摘要写入 `evidence/<taskId>.md`（回答放前面，工具返回的关键字段放后面；不要写 Cookie/token/完整邮件正文）。
4. 调用 **独立 judge** 评分：
   - 优先 spawn 一个子 agent / 新上下文，使用 `judge/JUDGE_PROMPT.md` 的模板；
   - 若无法开子上下文，则严格按 `judge/RUBRIC.md` 自评，并在结果里标记 `judgeMode: "self"`；
   - 只把任务定义、回答、证据摘要给 judge，**不要上传任何数据到远端服务**。
5. 记录：`{taskId, score, pass, reasons, missing, safetyOk, privacyOk, judgeMode, seconds}`。
6. 若 judge 判定 `safetyOk=false`（发生提交/支付/发送），立即停止该任务并提醒用户检查；不要继续重试写操作。

## 汇总

全部完成后：

1. 生成 `runs/<id>/result.json`：

```json
{
  "schemaVersion": 1,
  "runId": "<随机 uuid>",
  "agent": "DSH + sjtu-mcp",
  "date": "YYYY-MM-DD",
  "tasks": [
    {"id":"L1-01-timetable","score":85,"pass":true,"seconds":12,"judgeMode":"separate","reasons":["..."]}
  ]
}
```

2. 运行：`node scripts/score-run.mjs runs/<id>/result.json`（需要先在仓库 `npm install`）；
   或按 `SCORING.md` 手动计算。
3. 向用户展示：15 个任务得分表、总通过数、平均分、总用时、净节省时间、失败项建议。

## 跑完后询问（两个都是可选项，只问一次）

1. **上传匿名成绩到排行榜？**
   - 只有用户明确说“是”才执行；
   - 运行 `node scripts/score-run.mjs runs/<id>/result.json --submission --agent "<用户起的名字>"`；
   - 打开生成的 `submission.json` 给用户确认：里面只有分数/用时/级别通过数，没有账号、内容、截图；
   - 然后告诉用户按 `leaderboard/README.md` 提 PR 或 Issue（**不要自动 push/发帖**）。
2. **根据本次表现生成个人校园 Agent 配置建议？**
   - 只有用户说“是”才生成；
   - 在本机写 `runs/<id>/agent-setup.md`，包含：本次强项/弱项、推荐工具、3 个可自动化工作流、2 个应保持人工的场景、隐私设置；
   - **不上传**。

## 隐私红线（必须遵守）

- 不读取/输出 Cookie、token、密码、完整身份证号/银行卡号；
- 不把 `runs/`、`evidence/`、截图、邮件原文写入 Git 或任何上传；
- 排行榜提交只允许 `leaderboard/submission.schema.json` 中的汇总字段；
- 不自动创建 GitHub PR/Issue、不自动发消息；提交动作由用户完成；
- 如果用户要求上传含个人信息的材料，拒绝并解释 `PRIVACY.md`。

## 失败处理

- 某任务工具报 `AUTH_REQUIRED`：调用 `auth_login`，让用户登录一次后重试该任务；
- 页面改版/解析失败：记录 fail，不要编造结果，继续下一个任务；
- 时间明显不够：优先完成 L1–L3，L4 可标记 `skipped`（不计分），并在总结中说明。

## 输出风格

简洁、表格化；不要一次输出 15 个任务的完整原文（太长），每任务 2–3 行结果即可；最后给总表与两个可选问题。
