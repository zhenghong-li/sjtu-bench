import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const args = process.argv.slice(2);
const get = (flag) => {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : undefined;
};
const coldPath = get('--cold');
const warmPath = get('--warm');
const agentLabelArg = get('--agent') ?? '';
const outPath = get('--out') ?? 'submission.json';

if (!coldPath || !warmPath) {
  console.error('用法：node scripts/make-submission.mjs --cold runs/cold/summary.json --warm runs/warm/summary.json --agent "你的 agent 名字" [--out submission.json]');
  process.exit(1);
}
for (const file of [coldPath, warmPath]) {
  if (!fs.existsSync(file)) {
    console.error('找不到 summary：' + file);
    process.exit(1);
  }
}

const cold = JSON.parse(fs.readFileSync(coldPath, 'utf8'));
const warm = JSON.parse(fs.readFileSync(warmPath, 'utf8'));
if (cold.schemaVersion !== 2 || warm.schemaVersion !== 2) {
  console.error('summary 不是 v2，请用新版 score-run.mjs 重新生成');
  process.exit(1);
}
if (cold.tasksTotal !== warm.tasksTotal) {
  console.error('cold/warm 的任务数不一致');
  process.exit(1);
}

const label = String(agentLabelArg || warm.agent || cold.agent || 'unknown')
  .replace(/[\r\n\t]/g, ' ')
  .trim()
  .slice(0, 40);
if (!label || label.includes('@') || /https?:\/\//i.test(label)) {
  console.error('agentLabel 请使用不含邮箱/网址的简短名字（≤40 字符）');
  process.exit(1);
}

const coldElapsed = Number(cold.elapsedSeconds);
const warmElapsed = Number(warm.elapsedSeconds);
if (!Number.isFinite(coldElapsed) || !Number.isFinite(warmElapsed) || coldElapsed < 0 || warmElapsed < 0) {
  console.error('summary 中的 elapsedSeconds 无效');
  process.exit(1);
}

const summaryBlock = (summary) => ({
  tasksTotal: summary.tasksTotal,
  tasksPassed: summary.tasksPassed,
  scoreAvg: summary.scoreAvg,
  elapsedSeconds: summary.elapsedSeconds,
  timedOut: summary.timedOut,
});

const submission = {
  schemaVersion: 2,
  runId: crypto.randomUUID(),
  agentLabel: label,
  date: new Date().toISOString().slice(0, 10),
  benchmarkVersion: 'v2',
  cold: summaryBlock(cold),
  warm: summaryBlock(warm),
  timeSavedSeconds: Math.round(coldElapsed - warmElapsed),
  speedup: warmElapsed > 0 ? Math.round((coldElapsed / warmElapsed) * 100) / 100 : null,
  consent: true,
};

fs.writeFileSync(outPath, JSON.stringify(submission, null, 2) + '\n');
console.log(`已生成匿名提交：${path.resolve(outPath)}`);
console.log(`cold: ${cold.tasksPassed}/${cold.tasksTotal}，${coldElapsed}s`);
console.log(`warm: ${warm.tasksPassed}/${warm.tasksTotal}，${warmElapsed}s`);
console.log(`净节省：${submission.timeSavedSeconds}s，提速：${submission.speedup}x`);
console.log('检查后再按 leaderboard/README.md 提交（PR 或 Issue）。');
