# SJTU-Bench 宣传物料

## 一句话卖点

**登一次 jAccount，用 15 个真实校园任务，测测你的 AI 到底能不能帮你办事。**

---

## 水源版（可直接发）

**标题**：做了个 SJTU-Bench：15 个校园任务，测测你的 AI 能不能真的办事

**正文**：

最近把交大校园系统（教务、交我办、水源、公众号、邮箱、云盘、报销）接成了 MCP 工具，顺手做了个娱乐向的小 bench——**SJTU-Bench**。

15 个任务，L1 查课表/通知，L2 跨源汇总，L3 多步流程（报销只预填，不提交），L4 校园简报和 Agent 方案。对 agent 说一句：

> 我要试一试 sjtubench

就会自动跑完、LLM 评分、汇总用时和净节省时间。跑完可以选择上传匿名成绩到排行榜（默认不上传，账号/内容/截图都不会离开本机）。

我自己先试跑了一把：**14/15 通过，79.7 分**，净节省约 90 分钟（其中公众号文章读取被搜狗反爬卡住了，这个会继续修）。仓库里目前就我一条 demo 记录，欢迎来把榜一顶掉（或者单纯来吐槽任务太简单）。

项目地址：https://github.com/zhenghong-li/sjtu-bench

不是发论文的 benchmark，就是想让更多同学第一次感受到"AI 真的能帮我省点事"。写新任务也欢迎提 PR。

---

## 小红书版（可直接发，**不放链接**）

**标题**：交大同学，来测测你的 AI 会不会办事 👀

**正文**：

我做了个 SJTU-Bench：15 个真实校园任务，登一次 jAccount 就能让 agent 跑。

L1 查课表/通知/水源
L2 DDL/公众号/邮箱/活动
L3 报销/政务流程/云盘（只预填，不提交）
L4 校园简报 + 你的 Agent 配置方案

对 agent 说：
**"我要试一试 sjtubench"**

→ 自动跑任务 → LLM 打分 → 匿名排行榜（可选上传，账号信息不出本机）

我试跑：14/15，79.7 分，净省约 90 分钟（一个公众号任务被反爬卡了，还在修）。

GitHub 搜：SJTU-Bench（小红书不能放链接，麻烦手动搜一下）
有 agent 的同学来把榜一顶掉；没有的也可以来提新任务/看热闹。

\#上海交通大学 #SJTU #AI #Agent #效率工具 #校园生活

---

## 给 AI 的"改写/发帖"prompt

> 你是上海交通大学的一名学生。请帮我把下面这个项目改写成一条适合发在「水源社区」的帖子（或小红书笔记），要求：开头 1 句就抓住人，正文 150–250 字，只讲 3 个重点（15 个真实校园任务、登录一次 jAccount、匿名排行榜/隐私不出本机），语气真诚、不夸大、不标题党，结尾给出触发词"我要试一试 sjtubench"。**水源版可以放 GitHub 链接；小红书版不要放链接，改成「GitHub 搜：SJTU-Bench」。** 项目信息：SJTU-Bench，15 个任务 L1–L4，LLM 评分，可选匿名上榜，仓库 https://github.com/zhenghong-li/sjtu-bench 。

---

## 生图 prompt（给 GPT / DALL·E / Midjourney）

### 版本 A：只生成背景（推荐，文字后期加）

> A clean, modern tech poster background for a university AI benchmark. Dark navy background (#0B1220), subtle geometric glow, a few translucent circles and thin grid lines in the corners, one bright cyan accent bar on the left edge, lots of negative space in the center for text. Minimal, premium, editorial style, no text, no letters, no logos, no watermark. 3:4 portrait, high resolution, flat vector-like gradients.

生成后把海报文字（标题/四个 L 级/触发词/仓库链接）叠上去即可。

### 版本 B：带英文标题的完整海报（中文文字仍建议后期叠加）

> A dark navy tech poster, portrait 3:4. Large bold white headline "SJTU-" and bright cyan "BENCH" stacked on the left. Below: subtitle "15 CAMPUS AI TASKS". Four small colored tags (lime, cyan, orange, purple) with labels "L1", "L2", "L3", "L4". On the right/bottom a rounded dark card with the quote: "Try sjtubench". Minimal, premium, high contrast, flat vector illustration, no other text, no logos, no watermark.

> 注意：AI 生图对中文文字经常糊/错字，建议**只生成背景**，标题和文案用 PPT/Canva 叠；上面附的 PPTX 已经是可直接用的成品。

---

## 发布建议

- 水源：配 16:9 海报（`assets/sjtu-bench-poster-16x9.png`）；
- 小红书：配 3:4 海报（`assets/sjtu-bench-poster-3x4.png`），首图建议用海报，第二张放排行榜/任务列表截图；
- 评论区置顶：仓库链接 + "有问题/想加任务直接提 Issue"；
- 不要公开任何个人运行证据（课表、邮件、发票、ZIRC 截图）；
- 排行榜 demo 数据标注为自评，欢迎挑战。
