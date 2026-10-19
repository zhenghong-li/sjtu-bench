# 任务格式

每个任务是一个 YAML 文件（`tasks/Lx-xx-name.yaml`），字段如下：

```yaml
id: L1-01-timetable          # 唯一 id，L{级别}-{序号}-{短名}
title: 今日课表
level: L1                    # L1 | L2 | L3 | L4
manualMinutes: 2             # 人工完成大致耗时（分钟），用于计算节省时间
safety: read-only            # read-only | prefill
tools:                       # 允许使用的 sjtu-mcp 工具（只作提示，不强制）
  - timetable_get
  - calendar_events
prompt: |
  给 agent 的任务说明。
evidence:
  - 回答中应包含哪些信息
  - 工具调用摘要/本地截图
judge:
  passScore: 60
  criteria:
    - 评分点 1
    - 评分点 2
notes: |
  额外说明（可选）
```

## 规则

- 任务必须对所有交大学生**可完成**；不依赖某个人的特定项目/发票/课程；
- 默认只读；涉及写操作只能"预填/打开页面"，明确禁止提交/支付/发送；
- 不要求上传任何数据；证据只存本机；
- 不设计"猜谜/脑筋急转弯"式难题，考察真实使用能力；
- 新任务请附 `manualMinutes` 的依据（大致步骤数）。

## 当前任务

L1：今日课表 / 教务通知关键信息 / 水源搜索 / 交我办服务搜索

L2：一周 DDL 汇总 / 公众号文章摘要 / 邮箱搜索 / 活动筛选

L3：跨源政策核对 / 云盘查找 / AI 报销流程（预填可选） / 交我办办事流程规划

L4：今日校园简报 / 关键词订阅工作流设计 / 个人 Agent 配置建议
