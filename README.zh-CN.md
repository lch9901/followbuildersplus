[English](README.md) | **中文**

# followbuildersplus

`followbuildersplus` 是基于 Zara 原版 `follow-builders` 做的一次增强型分支。

它保留了原项目最核心的判断标准：关注真正做产品、做研究、做工程的人，而不是只会重复信息的 AI 网红。  
在这个基础上，这个版本把“摘要推送”进一步升级成了“摘要 + 编号 + 可追溯详情”的工作流。

## 这个版本解决了什么问题

原版 `follow-builders` 很适合接收一份整理好的 AI digest。  
而 `followbuildersplus` 更适合拿来做“信息收件箱”：

- 先看一份带编号的摘要
- 再挑值得展开的条目继续追问
- 需要时回看当天模型处理前后的本地归档

所以它更适合这些场景：

- 每天固定时间收 AI builders 的信号
- 用统一编号追踪某一条内容
- 需要回看历史条目
- 想知道模型总结之前到底拿到了什么原始数据

## 核心能力

除了继承原版的 feed 获取、内容重组和消息投递能力，这个版本新增了几层更适合长期使用的能力：

- 为每条 digest 内容分配稳定编号，例如 `FB20260323001`
- 每天把原始 feed 数据完整归档到本地
- 每天把 digest 工作数据单独归档到本地
- 支持通过完整编号回查详情
- 输出更稳定、更适合在飞书里阅读的 digest 排版

## 相比原版新增了什么

### 1. 稳定编号

每条最终 digest 条目都会获得一个稳定编号，格式为：

`FBYYYYMMDDXXX`

例如：

`FB20260323007`

这个编号既能出现在摘要里，也能作为后续查询详情的入口。

### 2. 双轨归档

这个版本会把每天的数据拆成两层保存：

- 原始归档：保存当天拉回来的完整 feed 原始数据
- digest 归档：保存进入摘要工作流的结构化条目

这样你可以同时看到：

- 上游 feed 给了什么
- 本地准备阶段整理了什么
- 最后真正发出去的 digest 是什么

### 3. 按编号查详情

如果你的投递渠道支持继续聊天，例如飞书，那么你可以直接发送完整编号，例如：

`FB20260323007`

系统就可以从本地归档中把对应条目的详情查出来再发给你。

### 4. 更稳定的摘要格式

这个版本对 digest 输出格式做了更严格的约束，更适合在飞书这种聊天工具中阅读、筛选和追问。

## 工作原理

整体流程是这样的：

1. 中心 feed 更新最新的 X 帖子和 podcast transcript
2. `prepare-digest.js` 拉取 feed 和本地配置
3. 脚本先把当天拉到的完整原始数据写入 raw archive
4. 脚本再生成 digest 用的结构化条目，并分配 `FB...` 编号
5. 这些 digest 条目被写入 digest archive
6. Agent 结合 prompt 生成最终摘要
7. 摘要被投递到聊天工具
8. 之后如果输入完整编号，可以从归档里回查详情

## 仓库结构

```text
config/
  config-schema.json
  default-sources.json
examples/
  sample-digest.md
prompts/
  digest-intro.md
  summarize-podcast.md
  summarize-tweets.md
  translate.md
scripts/
  deliver.js
  generate-feed.js
  lookup-detail.js
  prepare-digest.js
README.md
README.zh-CN.md
SKILL.md
feed-podcasts.json
feed-x.json
state-feed.json
```

## 本地数据目录

安装并运行后，这个分支默认使用自己独立的本地目录：

- 配置目录：`~/.followbuildersplus/`
- 原始归档：`~/.followbuildersplus/archive/raw/`
- digest 归档：`~/.followbuildersplus/archive/digest/`

这样做的目的是和原版 `follow-builders` 完全隔离，互不干扰。

## 安装

### OpenClaw

```bash
git clone https://github.com/lch9901/followbuildersplus.git ~/skills/followbuildersplus
cd ~/skills/followbuildersplus/scripts && npm install
```

### Claude Code

```bash
git clone https://github.com/lch9901/followbuildersplus.git ~/.claude/skills/followbuildersplus
cd ~/.claude/skills/followbuildersplus/scripts && npm install
```

## 使用方式

安装后，你可以让 agent：

- 每天定时发送一份 builders digest
- 在摘要中给每条内容输出 `FB...` 编号
- 把每天的数据存到本地
- 在你发送完整编号后，返回对应条目的详情

一个典型例子：

- 摘要中出现：`FB20260323007`
- 你继续发送：`FB20260323007`
- 系统从本地归档中找到这条并返回详情

## 默认信息源

### 播客

- [Latent Space](https://www.youtube.com/@LatentSpacePod)
- [Training Data](https://www.youtube.com/playlist?list=PLOhHNjZItNnMm5tdW61JpnyxeYH5NDDx8)
- [No Priors](https://www.youtube.com/@NoPriorsPodcast)
- [Unsupervised Learning](https://www.youtube.com/@RedpointAI)
- [Data Driven NYC](https://www.youtube.com/@DataDrivenNYC)

### X 上的 AI Builders

[Andrej Karpathy](https://x.com/karpathy), [Swyx](https://x.com/swyx),
[Josh Woodward](https://x.com/joshwoodward), [Kevin Weil](https://x.com/kevinweil),
[Peter Yang](https://x.com/petergyang), [Nan Yu](https://x.com/thenanyu),
[Madhu Guru](https://x.com/realmadhuguru), [Amanda Askell](https://x.com/AmandaAskell),
[Cat Wu](https://x.com/_catwu), [Thariq](https://x.com/trq212),
[Google Labs](https://x.com/GoogleLabs), [Amjad Masad](https://x.com/amasad),
[Guillermo Rauch](https://x.com/rauchg), [Alex Albert](https://x.com/alexalbert__),
[Aaron Levie](https://x.com/levie), [Ryo Lu](https://x.com/ryolu_),
[Garry Tan](https://x.com/garrytan), [Matt Turck](https://x.com/mattturck),
[Zara Zhang](https://x.com/zarazhangrui), [Nikunj Kothari](https://x.com/nikunj),
[Peter Steinberger](https://x.com/steipete), [Dan Shipper](https://x.com/danshipper),
[Aditya Agarwal](https://x.com/adityaag), [Sam Altman](https://x.com/sama),
[Claude](https://x.com/claudeai)

## 环境要求

- 一个可运行 skill 的 AI agent 环境，例如 OpenClaw 或 Claude Code
- 可访问中心 feed 的网络连接
- 用于执行 `scripts/` 下脚本的 Node.js 环境

正常使用 digest 不需要你自己配置 X 或 YouTube 的 API key。

## 隐私

- 这个 skill 使用的是中心化准备好的公开内容 feed
- 你的本地配置和归档数据保存在你自己的设备上
- 如果你接入投递凭证，也应该只保存在本地环境中

## 致谢

本项目基于 Zara Zhang 的原始项目
[`follow-builders`](https://github.com/zarazhangrui/follow-builders) 进行增强，
重点增加了稳定编号、本地归档和按编号回查详情等能力。

## 许可证

MIT
