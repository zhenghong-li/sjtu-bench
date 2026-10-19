# 任务格式（Harness-Agnostic）

每个任务是一个 YAML 文件（`tasks/Lx-xx-name.yaml`）：

```yaml
id: L1-01-timetable
title: 今日课表
level: L1
manualMinutes: 2          # 普通同学手动完成的大致时间（仅参考）
referenceSeconds: 12      # 维护者用成熟工具跑一遍的用时
timeLimitSeconds: 18      # ceil(referenceSeconds × 1.5)，硬时限；超时=失败
safety: read-only         # read-only | prefill
tools:                    # 可选参考工具（不是要求；任何方式完成都可以）
  - timetable_get
prompt: |
  给 agent 的任务目标。不要写死某个 harness 或工具名。
evidence:
  - 回答中应包含哪些信息
judge:
  passScore: 60
  criteria:
    - 评分点 1
    - 评分点 2
notes: |
  额外说明（可选）
```

## 规则

- **不依赖任何 harness/工具**：`tools` 只是参考；agent 可以用浏览器、shell、自写脚本或任何方式；
- 对**所有交大学生可完成**，不依赖某个人的特定项目/发票/课程；
- 默认只读；写操作只能"预填/打开页面"，禁止提交/支付/报名/发送；
- `timeLimitSeconds` 是硬时限：超时即失败，即使答案正确；
- 证据只存本机，不上传；
- 不设计猜谜题，考察真实使用与搭建工作流的能力。

## 当前任务

L1：今日课表 / 教务通知 / 水源搜索 / 交我办服务

L2：一周 DDL / 公众号文章 / 邮箱搜索 / 活动筛选

L3：跨源政策核对 / 云盘查找 / 报销流程（预填可选） / 交我办办事规划

L4：今日校园简报 / 关键词订阅工作流设计 / 个人 Agent 配置建议
