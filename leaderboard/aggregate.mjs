import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '..');
const submissionsDir = path.join(here, 'submissions');
const readmePath = path.join(repoRoot, 'README.md');

const ALLOWED_KEYS = [
  'schemaVersion',
  'runId',
  'agentLabel',
  'date',
  'benchmarkVersion',
  'cold',
  'warm',
  'timeSavedSeconds',
  'speedup',
  'consent',
];
const BLOCK_KEYS = ['tasksTotal', 'tasksPassed', 'scoreAvg', 'elapsedSeconds', 'timedOut'];

function fail(file, message) {
  throw new Error(`${file}: ${message}`);
}

function validBlock(file, block, name) {
  if (!block || typeof block !== 'object') fail(file, `${name} 缺失`);
  for (const key of BLOCK_KEYS) {
    if (block[key] === undefined) fail(file, `${name}.${key} 缺失`);
  }
  for (const key of ['tasksTotal', 'tasksPassed', 'timedOut']) {
    if (!Number.isInteger(block[key]) || block[key] < 0) fail(file, `${name}.${key} 无效`);
  }
  for (const key of ['scoreAvg', 'elapsedSeconds']) {
    if (typeof block[key] !== 'number' || block[key] < 0) fail(file, `${name}.${key} 无效`);
  }
}

function loadSubmissions() {
  if (!fs.existsSync(submissionsDir)) return [];
  const rows = [];
  for (const file of fs.readdirSync(submissionsDir)) {
    if (!file.endsWith('.json')) continue;
    const full = path.join(submissionsDir, file);
    let data;
    try {
      data = JSON.parse(fs.readFileSync(full, 'utf8'));
    } catch (error) {
      console.warn(`跳过无法解析的提交 ${file}: ${error.message}`);
      continue;
    }
    try {
      if (data.schemaVersion !== 2) fail(file, '只接受 schemaVersion 2（cold/warm 格式）');
      for (const key of Object.keys(data)) {
        if (!ALLOWED_KEYS.includes(key)) fail(file, `包含不允许的字段 ${key}`);
      }
      for (const key of ALLOWED_KEYS) {
        if (data[key] === undefined) fail(file, `缺少字段 ${key}`);
      }
      if (data.benchmarkVersion !== 'v2') fail(file, 'benchmarkVersion 必须为 v2');
      if (data.consent !== true) fail(file, 'consent 必须为 true');
      if (!/^[0-9a-fA-F-]{36}$/.test(String(data.runId))) fail(file, 'runId 不是 UUID');
      if (typeof data.agentLabel !== 'string' || !data.agentLabel.trim()) fail(file, 'agentLabel 无效');
      if (/@|https?:\/\//i.test(data.agentLabel)) fail(file, 'agentLabel 不能含邮箱/网址');
      if (data.agentLabel.length > 40) fail(file, 'agentLabel 过长');
      validBlock(file, data.cold, 'cold');
      validBlock(file, data.warm, 'warm');
      if (typeof data.timeSavedSeconds !== 'number') fail(file, 'timeSavedSeconds 无效');
      if (data.speedup !== null && (typeof data.speedup !== 'number' || data.speedup < 0)) {
        fail(file, 'speedup 无效');
      }
      rows.push(data);
    } catch (error) {
      console.warn('跳过提交 ' + file + '：' + error.message);
    }
  }
  return rows;
}

function escapeCell(value) {
  return String(value).replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
}

const rows = loadSubmissions().sort((a, b) => {
  if (b.timeSavedSeconds !== a.timeSavedSeconds) return b.timeSavedSeconds - a.timeSavedSeconds;
  if ((b.speedup ?? 0) !== (a.speedup ?? 0)) return (b.speedup ?? 0) - (a.speedup ?? 0);
  return b.warm.scoreAvg - a.warm.scoreAvg;
});

const table = [
  '| # | Agent | Cold 通过 | Cold 用时 | Warm 通过 | Warm 用时 | 提速 | 日期 |',
  '|---|-------|-----------|-----------|-----------|-----------|------|------|',
];
if (rows.length === 0) {
  table.push('| — | 暂无提交，等你来 | — | — | — | — | — | — |');
} else {
  rows.slice(0, 50).forEach((row, index) => {
    table.push(
      `| ${index + 1} | ${escapeCell(row.agentLabel)} | ${row.cold.tasksPassed}/${row.cold.tasksTotal} | ${Math.round(row.cold.elapsedSeconds)}s | ${row.warm.tasksPassed}/${row.warm.tasksTotal} | ${Math.round(row.warm.elapsedSeconds)}s | ${row.speedup ? row.speedup + 'x' : '—'} | ${escapeCell(row.date)} |`,
    );
  });
}

const startMarker = '<!-- LEADERBOARD:START -->';
const endMarker = '<!-- LEADERBOARD:END -->';
const readme = fs.readFileSync(readmePath, 'utf8');
const start = readme.indexOf(startMarker);
const end = readme.indexOf(endMarker);
if (start < 0 || end < 0 || end < start) {
  console.error('README 中找不到排行榜标记 ' + startMarker + ' / ' + endMarker);
  process.exit(1);
}
const next =
  readme.slice(0, start + startMarker.length) +
  '\n' +
  table.join('\n') +
  '\n' +
  readme.slice(end);
fs.writeFileSync(readmePath, next);
console.log(`已更新排行榜：${rows.length} 条提交，展示 ${Math.min(rows.length, 50)} 条`);
