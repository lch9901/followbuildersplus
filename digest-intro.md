# Digest Intro Prompt

You are assembling the final digest from individual source summaries.

## Format

Start with this header (replace [Date] with today's date):

AI Builders Digest — [Date]

Then organize content in this exact order:

1. Title line
2. Blank line
3. `X / Twitter`
4. X items
5. Blank line
6. `Podcasts`
7. Podcast items

## Rules

- Only include sources that have new content
- Skip any source with nothing new
- Under each source, paste the individual summary you generated
- Every included item must begin with its exact ID from the JSON in square brackets
  (example: `[FB20260322001]`)
- The bracketed ID must come from the item's top-level `id` field only
- Never use tweet `id`, podcast `videoId`, URL fragments, or any source-native identifier
- Use a stable digest layout instead of free-form prose
- Every X item must use exactly 3 lines:
  - line 1: `[ID] 人名/公司 + 主题`
  - line 2: `一句到两句中文摘要`
  - line 3: `原始 tweet URL`
- Every podcast item must also use exactly 3 lines:
  - line 1: `[ID] 播客名 | 主题`
  - line 2: `一句到两句中文摘要`
  - line 3: `YouTube URL`
- Do not collapse multiple items into one paragraph
- Keep a blank line between items

### Podcast links
- After each podcast summary, include the specific video URL from the JSON `url` field
  (e.g. https://youtube.com/watch?v=Iu4gEnZFQz8)
- NEVER link to the channel page. Always link to the specific video.
- Include the exact episode title from the JSON `title` field in the heading

### Tweet author formatting
- Use the author's full name and role/company, not just their last name
  (e.g. "Box CEO Aaron Levie" not "Levie")
- NEVER write Twitter handles with @ in the digest. On Telegram, @handle becomes
  a clickable link to a Telegram user, which is wrong. Instead write handles
  without @ (e.g. "Aaron Levie (levie on X)" or just use their full name)
- Include the direct link to each tweet from the JSON `url` field

### Mandatory links
- Every single piece of content MUST have an original source link
- Podcasts: the YouTube video URL (e.g. https://youtube.com/watch?v=xxx)
- Tweets: the direct tweet URL (e.g. https://x.com/levie/status/xxx)
- If you don't have a link for something, do NOT include it in the digest.
  No link = not real = do not include.

### No fabrication
- Only include content that came from the feed JSON (podcasts and tweets)
- NEVER make up quotes, opinions, or content you think someone might have said
- NEVER speculate about someone's silence or what they might be working on
- If you have nothing real for a builder, skip them entirely

### General
- Do not add any reply instruction, settings reminder, or call-to-action line
- Keep formatting clean and scannable — this will be read on a phone screen
- Prefer 4-8 total items when enough material exists, but preserve the section headings and 3-line-per-item layout
