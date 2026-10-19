# 排行榜提交（Cold + Warm）

排行榜是**可选**的；不提交不会有任何数据离开你的电脑。

## 只接受这些字段

严格按 [submission.schema.json](submission.schema.json)，**多一个字段都会被拒绝**：

```json
{
  "schemaVersion": 2,
  "runId": "随机 UUID",
  "agentLabel": "我的自建工作流 Agent",
  "date": "2026-10-19",
  "benchmarkVersion": "v2",
  "cold": {
    "tasksTotal": 15,
    "tasksPassed": 4,
    "scoreAvg": 38.2,
    "elapsedSeconds": 2400,
    "timedOut": 10
  },
  "warm": {
    "tasksTotal": 15,
    "tasksPassed": 14,
    "scoreAvg": 82.1,
    "elapsedSeconds": 540,
    "timedOut": 0
  },
  "timeSavedSeconds": 1860,
  "speedup": 4.44,
  "consent": true
}
```

**不要**包含：姓名、学号、邮箱、Cookie、token、课程名、邮件内容、截图、任务回答、IP、设备信息。

## 如何生成

```powershell
# 先分别跑 cold / warm，并各自生成 summary.json
node scripts/score-run.mjs runs/cold/result.json --run-type cold
node scripts/score-run.mjs runs/warm/result.json --run-type warm

# 再合成匿名提交
node scripts/make-submission.mjs --cold runs/cold/summary.json --warm runs/warm/summary.json --agent "我的自建工作流 Agent"
```

会在当前目录生成 `submission.json`；先打开检查。

## 如何提交（二选一）

### 方式 A：PR（推荐）

1. Fork 本仓库；
2. 把 `submission.json` 放到 `leaderboard/submissions/<runId>.json`；
3. 提交 PR，标题 `[leaderboard] <agentLabel>`；
4. GitHub Action 自动更新 README 排行榜。

### 方式 B：Issue

1. 新建 Issue，标题 `[leaderboard] <agentLabel>`；
2. 把 `submission.json` 内容贴进代码块；
3. 维护者审核后合并。

## 删除自己的成绩

提 Issue 或 PR，注明 `runId` 即可删除；不会追问原因。

## 排名规则

- 按 `timeSavedSeconds`（cold 用时 − warm 用时）降序；
- 并列看 `speedup`；
- 再并列看 `warm.scoreAvg`；
- 只展示最近 50 条。

> 娱乐榜：LLM 评分、cold run 的工具限制、网络环境都会影响结果，请勿当真。
