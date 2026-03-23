**English** | [中文](README.zh-CN.md)

# followbuildersplus

`followbuildersplus` is a builders digest skill redesigned around a more useful
reading workflow for Chinese users.

Its core goal is not just to send you a list of links. It tries to turn the
daily stream of AI builder updates into something you can scan inside chat,
then expand item by item when something is actually worth your attention.

For many users, especially in chat-first workflows, "here are some links, go
open them yourself" is not a great product experience:

- the reading flow gets fragmented across platforms
- external links are inconvenient to open repeatedly
- most of the time, you only want the full detail for one or two items

So this project is designed around a different default: summarize first, then
let the user ask for detail without leaving the conversation.

What `followbuildersplus` adds is a more operational workflow:

- Stable item IDs like `FB20260323001`
- Daily local archives for both raw feed data and digest-ready items
- Follow-up lookup by full ID inside chat tools such as Feishu
- A more structured digest format for repeated reading and triage

## Why This Fork Exists

This project treats the digest as a readable inbox. You scan numbered items
first, then ask for detail only when a specific item is worth digging into.

We built it to solve a few practical problems:

- Daily signal monitoring
- Historical lookup by item ID
- Auditing what the model saw before summarization
- Reading detail directly in Feishu or chat instead of constantly opening links

## Core Capabilities

`followbuildersplus` keeps the original feed-remix-deliver workflow, and adds a
few practical layers on top:

- Aggregates content from curated AI builders on X/Twitter
- Aggregates new episodes from selected AI podcasts
- Generates a structured digest in Chinese, English, or bilingual mode
- Assigns a stable ID to every digest item
- Stores daily raw and digest archives locally
- Lets you request details later using the full item ID

## Why It Is Designed This Way

Many AI information products solve the discovery problem, but not the reading
problem.

In real use, the higher-frequency workflow is usually:

- skim what is worth paying attention to today
- choose one item that matters
- expand it immediately in the same chat window

That is why `followbuildersplus` does not treat the digest as the endpoint.
The digest is the entry point.

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

   This matters because it keeps summary and detail in the same conversation,
   instead of pushing the user out to X, YouTube, or another external page for
   every follow-up read.

4. Structured digest layout
   Digest output is formatted more consistently, which makes it easier to scan
   in Feishu and similar chat tools.

## Project Direction

The current version focuses on getting the core loop right:

- collect builder updates reliably
- generate a structured digest
- support detail lookup by ID
- preserve local archives for traceability

Over time, the source set can expand further:

- broader information sources
- more Chinese-language source material
- better detail retrieval and follow-up interaction

But for now, the priority is simple:

make it possible to complete the whole loop of "scan summary -> request detail
-> read more" inside chat.

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

## License

MIT
