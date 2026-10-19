import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

const tasksDir = path.resolve('tasks');
const files = fs
  .readdirSync(tasksDir)
  .filter((name) => name.endsWith('.yaml') || name.endsWith('.yml'))
  .sort();

const errors = [];
const ids = new Set();
const levels = { L1: 0, L2: 0, L3: 0, L4: 0 };

for (const file of files) {
  const full = path.join(tasksDir, file);
  let task;
  try {
    task = YAML.parse(fs.readFileSync(full, 'utf8'));
  } catch (error) {
    errors.push(`${file}: YAML 解析失败：${error.message}`);
    continue;
  }
  const required = ['id', 'title', 'level', 'manualMinutes', 'safety', 'prompt', 'judge'];
  for (const key of required) {
    if (task[key] === undefined || task[key] === null || task[key] === '') {
      errors.push(`${file}: 缺少字段 ${key}`);
    }
  }
  if (!/^L[1-4]-[0-9]{2}-[a-z0-9-]+$/.test(String(task.id))) {
    errors.push(`${file}: id 格式应为 L{1-4}-{两位序号}-{短名}，实际 ${task.id}`);
  }
  if (ids.has(task.id)) errors.push(`${file}: id 重复 ${task.id}`);
  ids.add(task.id);
  if (!['L1', 'L2', 'L3', 'L4'].includes(task.level)) {
    errors.push(`${file}: level 必须是 L1-L4`);
  } else {
    levels[task.level] += 1;
  }
  if (!['read-only', 'prefill'].includes(task.safety)) {
    errors.push(`${file}: safety 必须是 read-only 或 prefill`);
  }
  if (typeof task.manualMinutes !== 'number' || task.manualMinutes <= 0) {
    errors.push(`${file}: manualMinutes 必须是正数`);
  }
  if (task.tools !== undefined && !Array.isArray(task.tools)) {
    errors.push(`${file}: tools 必须是数组`);
  }
  if (!task.judge || typeof task.judge.passScore !== 'number' || !Array.isArray(task.judge.criteria)) {
    errors.push(`${file}: judge.passScore 必须是数字且 judge.criteria 必须是数组`);
  }
}

if (files.length < 15) {
  errors.push(`任务数 ${files.length} < 15；新增任务请保持主 bench 至少 15 个`);
}
if (levels.L1 + levels.L2 + levels.L3 + levels.L4 !== files.length) {
  errors.push('级别统计与任务数不一致');
}

if (errors.length > 0) {
  console.error('任务校验失败：');
  for (const error of errors) console.error(' - ' + error);
  process.exit(1);
}

console.log(`任务校验通过：${files.length} 个任务`);
console.log(`级别：L1=${levels.L1} L2=${levels.L2} L3=${levels.L3} L4=${levels.L4}`);
