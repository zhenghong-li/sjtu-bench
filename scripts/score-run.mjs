import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import YAML from 'yaml';

const args = process.argv.slice(2);
const resultPath = args.find((arg) => !arg.startsWith('--'));
const runTypeIndex = args.indexOf('--run-type');
const runTypeArg = runTypeIndex >= 0 ? args[runTypeIndex + 1] : undefined;

if (!resultPath) {
  console.error('用法：node scripts/score-run.mjs <runs/xxx/result.json> [--run-type cold|warm]');
  process.exit(1);
}
if (!fs.existsSync(resultPath)) {
  console.error('找不到结果文件：' + resultPath);
  process.exit(1);
}

const result = JSON.parse(fs.readFileSync(resultPath, 'utf8'));
const runType = runTypeArg ?? result.runType ?? 'cold';
if (!['cold', 'warm'].includes(runType)) {
  console.error('runType 必须是 cold 或 warm');
  process.exit(1);
}

const taskMeta = new Map();
const tasksDir = path.resolve('tasks');
for (const file of fs.readdirSync(tasksDir).filter((name) => name.endsWith('.yaml'))) {
  const task = YAML.parse(fs.readFileSync(path.join(tasksDir, file), 'utf8'));
  taskMeta.set(task.id, task);
}

const seen = new Set();
const rows = [];
for (const entry of result.tasks ?? []) {
  const meta = taskMeta.get(entry.id);
  if (!meta) {
    console.warn(`忽略未知任务：${entry.id}`);
    continue;
  }
  if (seen.has(entry.id)) {
    console.warn(`重复任务，忽略：${entry.id}`);
    continue;
  }
  seen.add(entry.id);
  const score = Number(entry.score);
  const seconds = Number(entry.seconds);
  const timeout = Boolean(entry.timeout);
  if (!Number.isFinite(score) || score < 0 || score > 100) {
    console.error(`任务 ${entry.id} 分数无效：${entry.score}`);
    process.exit(1);
  }
  if (!Number.isFinite(seconds) || seconds < 0) {
    console.error(`任务 ${entry.id} 用时无效：${entry.seconds}`);
    process.exit(1);
  }
  const passScore = Number(meta.judge?.passScore ?? 60);
  const timeLimitSeconds = Number(meta.timeLimitSeconds);
  if (!Number.isFinite(timeLimitSeconds) || timeLimitSeconds <= 0) {
    console.error(`任务 ${entry.id} 缺少 timeLimitSeconds，请检查任务 YAML`);
    process.exit(1);
  }
  const pass = !timeout && score >= passScore && seconds <= timeLimitSeconds;
  rows.push({
    id: entry.id,
    level: meta.level,
    score: Math.round(score),
    seconds,
    timeLimitSeconds,
    timeout,
    pass,
    judgeMode: entry.judgeMode ?? 'separate',
    reasons: Array.isArray(entry.reasons) ? entry.reasons : [],
  });
}

for (const [id, meta] of taskMeta) {
  if (!seen.has(id)) {
    rows.push({
      id,
      level: meta.level,
      score: 0,
      seconds: 0,
      timeLimitSeconds: Number(meta.timeLimitSeconds),
      timeout: true,
      pass: false,
      judgeMode: 'missing',
      reasons: [],
    });
  }
}

const tasksPassed = rows.filter((row) => row.pass).length;
const scoreAvg = rows.reduce((sum, row) => sum + row.score, 0) / rows.length;
const elapsedSeconds = rows.reduce((sum, row) => sum + row.seconds, 0);
const timedOut = rows.filter((row) => row.timeout || row.seconds > row.timeLimitSeconds).length;
const limitsTotal = rows.reduce((sum, row) => sum + row.timeLimitSeconds, 0);

const summary = {
  schemaVersion: 2,
  runId: result.runId ?? crypto.randomUUID(),
  runType,
  agent: result.agent ?? 'unknown',
  date: result.date ?? new Date().toISOString().slice(0, 10),
  tasksTotal: rows.length,
  tasksPassed,
  scoreAvg: Math.round(scoreAvg * 10) / 10,
  elapsedSeconds,
  limitsTotal,
  timedOut,
  tasks: rows,
};

const summaryPath = path.join(path.dirname(resultPath), 'summary.json');
fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2) + '\n');

console.log(`轮次：${runType}`);
console.log(`通过：${tasksPassed}/${rows.length}（超时/超限：${timedOut}）`);
console.log(`平均分：${summary.scoreAvg}`);
console.log(`总用时：${elapsedSeconds}s / 时限合计 ${limitsTotal}s`);
console.log(`已写入：${summaryPath}`);
console.log('下一步：cold/warm 都完成后运行 scripts/make-submission.mjs（可选上传）。');
