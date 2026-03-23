**English** | [中文](README.zh-CN.md)

# followbuildersplus

An enhanced builders digest skill built on top of Zara's original
`follow-builders`.

It keeps the original idea intact: follow researchers, founders, PMs, and
engineers who are actually building in AI, not people who just echo the
timeline.

What `followbuildersplus` adds is a more operational workflow:

- Stable item IDs like `FB20260323001`
- Daily local archives for both raw feed data and digest-ready items
- Follow-up lookup by full ID inside chat tools such as Feishu
- A more structured digest format for repeated reading and triage

## Why This Fork Exists

The original version is excellent for receiving a curated digest.

This fork is for a slightly different use case: treating the digest as a
readable inbox. You scan numbered items first, then ask for detail only when a
specific item is worth digging into.

That makes it more useful for:

- Daily signal monitoring
- Historical lookup by item ID
- Auditing what the model saw before summarization
- Moving from "summary only" to "summary plus retrieval"

## Core Capabilities

`followbuildersplus` keeps the original feed-remix-deliver workflow, and adds a
few practical layers on top:

- Aggregates content from curated AI builders on X/Twitter
- Aggregates new episodes from selected AI podcasts
- Generates a structured digest in Chinese, English, or bilingual mode
- Assigns a stable ID to every digest item
- Stores daily raw and digest archives locally
- Lets you request details later using the full item ID

## What Makes It Different

Compared with the original `follow-builders`, this version adds:

1. Stable digest IDs
   Every digest item gets an ID in the format `FBYYYYMMDDXXX`.

2. Dual archives
   Raw upstream feed data and digest-ready structured items are stored
   separately, so you can inspect both the source input and the summarized
   output.

3. Detail lookup
   If your delivery channel supports follow-up chat, you can send a full ID such
   as `FB20260323007` and fetch the stored detail for that item.

4. Structured digest layout
   Digest output is formatted more consistently, which makes it easier to scan
   in Feishu and similar chat tools.

## How It Works

1. A central feed is updated with the latest X posts and podcast transcripts.
2. `prepare-digest.js` fetches the feed and local configuration.
3. The script writes a raw archive for the full fetched feed.
4. The script builds digest-ready items, assigns `FB...` IDs, and writes a
   digest archive.
5. Your agent uses the archived input plus prompts to generate the final digest.
6. The digest is delivered to chat.
7. Later, a full item ID can be used to look up detail from the stored archive.

## Repository Structure

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

## Local Data Layout

When installed and used locally, the fork expects its own directory space:

- Config: `~/.followbuildersplus/`
- Raw archives: `~/.followbuildersplus/archive/raw/`
- Digest archives: `~/.followbuildersplus/archive/digest/`

This separation is intentional. It keeps the fork independent from the original
`follow-builders` installation.

## Installation

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

## Typical Usage

After installation, your agent can be configured to:

- send a daily digest at a fixed time
- output structured items with `FB...` IDs
- store daily archives locally
- answer follow-up requests for a full item ID

Example:

- Digest item: `FB20260323007`
- Follow-up request: `FB20260323007`
- Result: the agent looks up the archived item and returns its detail

## Default Sources

### Podcasts

- [Latent Space](https://www.youtube.com/@LatentSpacePod)
- [Training Data](https://www.youtube.com/playlist?list=PLOhHNjZItNnMm5tdW61JpnyxeYH5NDDx8)
- [No Priors](https://www.youtube.com/@NoPriorsPodcast)
- [Unsupervised Learning](https://www.youtube.com/@RedpointAI)
- [Data Driven NYC](https://www.youtube.com/@DataDrivenNYC)

### AI Builders on X

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

## Requirements

- An AI agent environment such as OpenClaw or Claude Code
- Internet access to fetch the central feed
- Node.js for running the scripts in `scripts/`

No direct X or YouTube API key is required for normal digest consumption.

## Privacy

- The skill works on centrally prepared public content feeds
- Your local configuration and archives stay on your own machine
- Delivery credentials, if used, should remain in your local environment only

## Acknowledgement

This project is based on Zara Zhang's original
[`follow-builders`](https://github.com/zarazhangrui/follow-builders) and extends
it with local archiving, stable IDs, and follow-up retrieval workflows.

## License

MIT
