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
  'tasksTotal',
  'tasksPassed',
  'scoreAvg',
  'elapsedSeconds',
  'manualSeconds',
  'timeSavedSeconds',
  'levels',
  'consent',
];

function fail(file, message) {
  throw new Error(`${file}: ${message}`);
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
      for (const key of Object.keys(data)) {
        if (!ALLOWED_KEYS.includes(key)) fail(file, `包含不允许的字段 ${key}`);
      }
      for (const key of ALLOWED_KEYS) {
        if (data[key] === undefined) fail(file, `缺少字段 ${key}`);
      }
      if (data.schemaVersion !== 1) fail(file, 'schemaVersion 必须为 1');
      if (data.consent !== true) fail(file, 'consent 必须为 true');
      if (!/^[0-9a-fA-F-]{36}$/.test(String(data.runId))) fail(file, 'runId 不是 UUID');
      if (typeof data.agentLabel !== 'string' || !data.agentLabel.trim()) fail(file, 'agentLabel 无效');
      if (/@|https?:\/\//i.test(data.agentLabel)) fail(file, 'agentLabel 不能含邮箱/网址');
      if (data.agentLabel.length > 40) fail(file, 'agentLabel 过长');
      for (const key of ['tasksTotal', 'tasksPassed', 'elapsedSeconds', 'manualSeconds']) {
        if (typeof data[key] !== 'number' || data[key] < 0) fail(file, `${key} 无效`);
      }
      for (const key of ['scoreAvg', 'timeSavedSeconds']) {
        if (typeof data[key] !== 'number') fail(file, `${key} 无效`);
      }
      for (const level of ['L1', 'L2', 'L3', 'L4']) {
        const item = data.levels?.[level];
        if (!item || typeof item.passed !== 'number' || typeof item.total !== 'number') {
          fail(file, `levels.${level} 无效`);
        }
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
  if (b.scoreAvg !== a.scoreAvg) return b.scoreAvg - a.scoreAvg;
  return a.elapsedSeconds - b.elapsedSeconds;
});

const table = [
  '| # | Agent | 得分 | 通过 | 用时 | 净节省 | 日期 |',
  '|---|-------|------|------|------|--------|------|',
];
if (rows.length === 0) {
  table.push('| — | 暂无提交，等你来 | — | — | — | — | — |');
} else {
  rows.slice(0, 50).forEach((row, index) => {
    table.push(
      `| ${index + 1} | ${escapeCell(row.agentLabel)} | ${row.scoreAvg.toFixed(1)} | ${row.tasksPassed}/${row.tasksTotal} | ${Math.round(row.elapsedSeconds)}s | ${Math.round(row.timeSavedSeconds)}s | ${escapeCell(row.date)} |`,
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
