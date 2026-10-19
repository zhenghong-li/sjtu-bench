# 排行榜提交

排行榜是**可选**的：不提交不会有任何数据离开你的电脑。

## 只接受这些字段

严格按 [submission.schema.json](submission.schema.json)，**多一个字段都会被拒绝**：

```json
{
  "schemaVersion": 1,
  "runId": "随机 UUID",
  "agentLabel": "DSH + sjtu-mcp",
  "date": "2026-10-19",
  "tasksTotal": 15,
  "tasksPassed": 13,
  "scoreAvg": 82.4,
  "elapsedSeconds": 540,
  "manualSeconds": 900,
  "timeSavedSeconds": 360,
  "levels": {
    "L1": { "passed": 4, "total": 4 },
    "L2": { "passed": 4, "total": 4 },
    "L3": { "passed": 3, "total": 4 },
    "L4": { "passed": 2, "total": 3 }
  },
  "consent": true
}
```

**不要**包含：姓名、学号、邮箱、Cookie、token、课程名、邮件内容、截图、任务回答、IP、设备信息。

## 如何生成

```powershell
node scripts/score-run.mjs runs/<runId>/result.json --submission --agent "DSH + sjtu-mcp"
```

会在 `runs/<runId>/submission.json` 生成上面这份文件；先打开检查。

## 如何提交（二选一）

### 方式 A：PR（推荐）

1. Fork 本仓库；
2. 把 `submission.json` 放到 `leaderboard/submissions/<runId>.json`；
3. 提交 PR，标题 `[leaderboard] <agentLabel>`；
4. GitHub Action 会自动更新 README 排行榜（无需手动改表）。

### 方式 B：Issue

1. 新建 Issue，标题 `[leaderboard] <agentLabel>`；
2. 把 `submission.json` 内容贴进代码块；
3. 维护者审核后合并。

## 删除自己的成绩

提 Issue 或 PR，注明 `runId`，即可删除；不会追问原因。

## 排名规则

- 按 `timeSavedSeconds` 降序；
- 并列时按 `scoreAvg` 降序；
- 再并列按 `elapsedSeconds` 升序；
- 只展示最近 50 条；`unverified` 标记表示尚未人工抽查。

> 娱乐榜：LLM 评分和网络环境都会影响结果，请勿当真。
