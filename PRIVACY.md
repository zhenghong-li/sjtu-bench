# 隐私说明（请务必阅读）

SJTU-Bench 的底线：**你的校园数据只属于你。仓库、评分、排行榜都不需要、也不接收你的账号数据。**

## 1. 数据在哪

| 数据 | 位置 | 是否上传 |
|---|---|---|
| jAccount 登录态 / Cookie / token | 你本机 Chrome profile（由你选择的 agent/浏览器管理） | ❌ 永不 |
| 课表、邮件、云盘、发票、活动、ZIRC 内容 | 你本机 | ❌ 永不 |
| 任务证据（截图、原文、工具输出） | 本机 `runs/<runId>/evidence/` | ❌ 永不 |
| LLM 评分过程/理由 | 本机 `runs/<runId>/result.json` | ❌ 永不 |
| 匿名汇总成绩（**仅当你选择上传**） | 你提交的 `submission.json` | ✅ 可选 |

- 本仓库**没有服务器、没有遥测、没有隐藏上报**；它只是任务文件 + 本地脚本。
- 除非你明确选择"上传成绩"，否则跑完后**不会产生任何网络提交**。
- `runs/`、`evidence/`、`answers/`、`screenshots/` 已在 `.gitignore` 中，误 `git add` 也不会被提交。

## 2. 排行榜只收什么

严格限制为以下字段（schema 拒绝额外字段）：

```text
schemaVersion, runId（随机 UUID）, agentLabel（你自己起的名字，不含真名）,
date, benchmarkVersion, cold{...}, warm{...}, timeSavedSeconds, speedup, consent
```

每个 `cold`/`warm` 块只含：`tasksTotal, tasksPassed, scoreAvg, elapsedSeconds, timedOut`。

**绝不包含**：姓名、学号、jAccount、邮箱、手机号、Cookie/token、课程名、邮件内容、发票号、金额明细、截图、任务回答、IP、设备信息。

`scripts/make-submission.mjs` 只会从两轮 summary 中提取上述数字，并自动生成随机 `runId`；你可以先打开 `submission.json` 检查再决定是否提交。

## 3. 证据可能含个人数据

任务证据（例如"列出 3 封作业/课程邮件"）可能包含你本人的信息。请遵守：

- 证据只存本机，**不要**贴到 Issue/PR/群聊/截图分享；
- 需要公开讨论时，先手动脱敏（删除姓名、邮箱、链接 token、发票号等）；
- LLM judge 只读取本机证据，不联网上传。

## 4. 选择上传后会发生什么

1. agent 生成 `submission.json`，你人工检查；
2. 你按 [leaderboard/README.md](leaderboard/README.md) 提 PR（或 Issue 贴 JSON 由维护者合并）；
3. GitHub Action 只读取汇总数字，更新 README 排行榜；
4. 你随时可以提 Issue/PR 删除自己的提交（`runId` 可识别）。

## 5. 安全边界

- 任务中的写操作一律只到"预填/打开页面"，**不会自动提交、支付、报名、发邮件**；
- 不允许把账号密码交给 agent；登录由你本人在 Chrome 完成；
- 如果 agent 要求你粘贴 Cookie/token 或上传截图到第三方，**立即停止**——这不是本项目的行为。

## 6. 维护者承诺

- 不主动收集任何运行数据；
- 排行榜仅展示已提交的匿名汇总；
- 发现误提交的个人数据会删除并提醒；
- 本项目为个人娱乐项目，非学校官方，使用前请自行评估风险并遵守学校/平台条款。
