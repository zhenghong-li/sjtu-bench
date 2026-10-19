import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import YAML from 'yaml';

const args = process.argv.slice(2);
const resultPath = args.find((arg) => !arg.startsWith('--'));
const wantsSubmission = args.includes('--submission');
const agentIndex = args.indexOf('--agent');
const agentLabel = agentIndex >= 0 ? args[agentIndex + 1] ?? '' : 'unknown';

if (!resultPath) {
  console.error('用法：node scripts/score-run.mjs <runs/xxx/result.json> [--submission --agent "你的 agent 名字"]');
  process.exit(1);
}
if (!fs.existsSync(resultPath)) {
  console.error('找不到结果文件：' + resultPath);
  process.exit(1);
}

const tasksDir = path.resolve('tasks');
const taskMeta = new Map();
for (const file of fs.readdirSync(tasksDir).filter((name) => name.endsWith('.yaml'))) {
  const task = YAML.parse(fs.readFileSync(path.join(tasksDir, file), 'utf8'));
  taskMeta.set(task.id, task);
}

const result = JSON.parse(fs.readFileSync(resultPath, 'utf8'));
if (!Array.isArray(result.tasks) || result.tasks.length === 0) {
  console.error('result.json 缺少 tasks 数组');
  process.exit(1);
}

const seen = new Set();
const rows = [];
for (const entry of result.tasks) {
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
  if (!Number.isFinite(score) || score < 0 || score > 100) {
    console.error(`任务 ${entry.id} 分数无效：${entry.score}`);
    process.exit(1);
  }
  if (!Number.isFinite(seconds) || seconds < 0) {
    console.error(`任务 ${entry.id} 用时无效：${entry.seconds}`);
    process.exit(1);
  }
  rows.push({
    id: entry.id,
    level: meta.level,
    score: Math.round(score),
    pass: Boolean(entry.pass),
    seconds,
    manualSeconds: Math.round(Number(meta.manualMinutes) * 60),
    judgeMode: entry.judgeMode ?? 'separate',
  });
}

if (rows.length < taskMeta.size) {
  console.warn(`注意：只记录了 ${rows.length}/${taskMeta.size} 个任务；未记录的任务按未通过处理。`);
}
for (const [id, meta] of taskMeta) {
  if (!seen.has(id)) rows.push({ id, level: meta.level, score: 0, pass: false, seconds: 0, manualSeconds: 0, judgeMode: 'missing' });
}

const tasksPassed = rows.filter((row) => row.pass).length;
const scoreAvg = rows.reduce((sum, row) => sum + row.score, 0) / rows.length;
const elapsedSeconds = rows.reduce((sum, row) => sum + row.seconds, 0);
const manualSeconds = rows.filter((row) => row.pass).reduce((sum, row) => sum + row.manualSeconds, 0);
const timeSavedSeconds = manualSeconds - elapsedSeconds;
const levels = {};
for (const level of ['L1', 'L2', 'L3', 'L4']) {
  const all = rows.filter((row) => row.level === level);
  levels[level] = { passed: all.filter((row) => row.pass).length, total: all.length };
}

const summary = {
  schemaVersion: 1,
  runId: result.runId ?? crypto.randomUUID(),
  agent: result.agent ?? agentLabel,
  date: result.date ?? new Date().toISOString().slice(0, 10),
  tasksTotal: rows.length,
  tasksPassed,
  scoreAvg: Math.round(scoreAvg * 10) / 10,
  elapsedSeconds,
  manualSeconds,
  timeSavedSeconds,
  levels,
  tasks: rows,
};

const summaryPath = path.join(path.dirname(resultPath), 'summary.json');
fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2) + '\n');

console.log(`通过：${tasksPassed}/${rows.length}`);
console.log(`平均分：${summary.scoreAvg}`);
console.log(`总用时：${elapsedSeconds}s（人工基准 ${manualSeconds}s，净节省 ${timeSavedSeconds}s）`);
console.log(`级别：L1 ${levels.L1.passed}/${levels.L1.total} · L2 ${levels.L2.passed}/${levels.L2.total} · L3 ${levels.L3.passed}/${levels.L3.total} · L4 ${levels.L4.passed}/${levels.L4.total}`);
console.log(`已写入：${summaryPath}`);

if (wantsSubmission) {
  const label = String(agentLabel || summary.agent || 'unknown')
    .replace(/[\r\n\t]/g, ' ')
    .trim()
    .slice(0, 40);
  if (!label || label.includes('@') || /https?:\/\//i.test(label)) {
    console.error('agentLabel 请使用不含邮箱/网址的简短名字（≤40 字符）');
    process.exit(1);
  }
  const submission = {
    schemaVersion: 1,
    runId: crypto.randomUUID(),
    agentLabel: label,
    date: new Date().toISOString().slice(0, 10),
    tasksTotal: rows.length,
    tasksPassed,
    scoreAvg: summary.scoreAvg,
    elapsedSeconds,
    manualSeconds,
    timeSavedSeconds,
    levels,
    consent: true,
  };
  const submissionPath = path.join(path.dirname(resultPath), 'submission.json');
  fs.writeFileSync(submissionPath, JSON.stringify(submission, null, 2) + '\n');
  console.log(`\n已生成匿名提交文件：${submissionPath}`);
  console.log('它只包含分数/用时/级别汇总，不含账号、任务回答、截图或个人信息。');
  console.log('请打开检查后再按 leaderboard/README.md 提交（PR 或 Issue）。');
}
