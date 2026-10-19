# Self-Bench（自建特化任务）

主 bench 的 15 个任务对所有同学通用；**Self-Bench 是给你自己的特化任务**：比如 ZIRC 经费发生、真实发票报销、科研/社团工作流。

- 只在本地评分，**不会进入主排行榜**；
- 也可以完全不写代码：复制模板，改 prompt 和评分标准，让你的 agent 按同一套 judge 流程跑；
- 任务文件不要提交到本仓库（个人任务放 `self-bench/mine/`，已被 `.gitignore` 排除）。

## 快速使用

1. 复制模板：

```powershell
mkdir self-bench/mine
copy self-bench/TEMPLATE.yaml self-bench/mine/my-task.yaml
```

2. 修改 `id/title/prompt/tools/judge.criteria/manualMinutes`；
3. 让 agent 按 [skills/sjtubench/SKILL.md](../skills/sjtubench/SKILL.md) 的流程跑单个任务；
4. 评分后自己留存，不上传。

## 示例方向

- ZIRC「新增经费发生」预填（类型/金额/说明/发票号，停在提交审批前）；
- 真实发票 AI 报销预填（选发票/项目/摘要，停在提交前）；
- 科研资料整理：从云盘/邮件中找某个项目材料并归纳；
- 社团/班级事务：活动报名信息汇总、通知拟稿（只生成草稿，不发送）。

## 注意

- 特化任务更容易接触个人数据：**证据只存本机**，不要贴到 Issue/PR；
- 写操作只到预填/打开页面，绝不提交/支付/发送；
- 评分标准尽量可核查（来源、数字、链接），否则 LLM judge 会偏松。
