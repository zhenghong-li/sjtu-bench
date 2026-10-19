# 贡献指南

欢迎贡献任务、修 bug、改文档。

## 新增任务

1. 在 `tasks/` 新建 `L{1-4}-{两位序号}-{短名}.yaml`，格式见 [tasks/README.md](tasks/README.md)；
2. 运行校验：

```powershell
npm install
npm run validate
```

3. 提 PR（模板会提示检查项）。

### 任务要求

- **对所有交大学生可完成**：不依赖特定项目、发票、课程、导师；
- **只读优先**；写操作只能到"预填/打开页面"，绝不提交/支付/报名/发邮件；
- 不要求上传任何个人数据；证据留在本机；
- 不设计猜谜/脑筋急转弯；考察真实使用能力；
- 给出合理的 `manualMinutes`（按普通同学手动操作估算）。

## 排行榜提交

见 [leaderboard/README.md](leaderboard/README.md)。只接受匿名汇总字段，PR 合并后自动更新 README。

## 隐私红线（一票否决）

- 提交含姓名/学号/邮箱/Cookie/token/截图/邮件原文的 PR → 直接关闭；
- 任务要求 agent 上传个人数据 → 拒绝；
- 不要在 Issue/PR 里贴真实运行证据，先脱敏。

## 代码/文档

- Node.js 20+；
- 改脚本后请跑 `npm run validate` 和 `npm run leaderboard`（本地验证）；
- 保持 README、SCORING、PRIVACY 的一致性。

## 行为准则

- 友善、就事论事；
- 不鼓励刷榜、不鼓励绕过学校系统限制；
- 这是娱乐/学习项目，不是学校官方项目。
