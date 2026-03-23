#!/usr/bin/env node

// ============================================================================
// Follow Builders Plus — Prepare Digest
// ============================================================================
// Gathers everything the LLM needs to produce a digest:
// - Fetches the central feeds (tweets + podcasts)
// - Fetches the latest prompts from GitHub
// - Reads the user's config (language, delivery method)
// - Assigns stable IDs to every candidate item
// - Writes a daily archive to the local machine
// - Outputs a single JSON blob to stdout
// ============================================================================

import { readFile, mkdir, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const USER_DIR = join(homedir(), '.followbuildersplus');
const CONFIG_PATH = join(USER_DIR, 'config.json');
const ARCHIVE_DIR = join(USER_DIR, 'archive');
const RAW_ARCHIVE_DIR = join(ARCHIVE_DIR, 'raw');
const DIGEST_ARCHIVE_DIR = join(ARCHIVE_DIR, 'digest');

const FEED_X_URL = 'https://raw.githubusercontent.com/zarazhangrui/follow-builders/main/feed-x.json';
const FEED_PODCASTS_URL = 'https://raw.githubusercontent.com/zarazhangrui/follow-builders/main/feed-podcasts.json';

const PROMPTS_BASE = 'https://raw.githubusercontent.com/zarazhangrui/follow-builders/main/prompts';
const PROMPT_FILES = [
  'summarize-podcast.md',
  'summarize-tweets.md',
  'digest-intro.md',
  'translate.md'
];

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) return null;
  return res.json();
}

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) return null;
  return res.text();
}

function formatDateParts(date) {
  const year = String(date.getUTCFullYear());
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return {
    compact: `${year}${month}${day}`,
    dashed: `${year}-${month}-${day}`
  };
}

function buildStableId(dateCompact, index) {
  return `FB${dateCompact}${String(index).padStart(3, '0')}`;
}

function makeArchiveEntryFromBuilder(builder, dateKey) {
  return {
    id: builder.id,
    date: dateKey,
    type: 'x',
    title: `${builder.name} updates`,
    name: builder.name,
    handle: builder.handle,
    bio: builder.bio,
    primaryUrl: builder.tweets[0]?.url || null,
    sourceUrls: builder.tweets.map((tweet) => tweet.url).filter(Boolean),
    rawMaterial: {
      bio: builder.bio,
      tweets: builder.tweets
    }
  };
}

function makeArchiveEntryFromPodcast(podcast, dateKey) {
  return {
    id: podcast.id,
    date: dateKey,
    type: 'podcast',
    title: podcast.title,
    name: podcast.name,
    primaryUrl: podcast.url || null,
    sourceUrls: podcast.url ? [podcast.url] : [],
    rawMaterial: {
      transcript: podcast.transcript,
      publishedAt: podcast.publishedAt,
      videoId: podcast.videoId
    }
  };
}

async function loadPrompts(errors) {
  const prompts = {};
  const scriptDir = decodeURIComponent(new URL('.', import.meta.url).pathname);
  const localPromptsDir = join(scriptDir, '..', 'prompts');
  const userPromptsDir = join(USER_DIR, 'prompts');

  for (const filename of PROMPT_FILES) {
    const key = filename.replace('.md', '').replace(/-/g, '_');
    const userPath = join(userPromptsDir, filename);
    const localPath = join(localPromptsDir, filename);

    if (existsSync(userPath)) {
      prompts[key] = await readFile(userPath, 'utf-8');
      continue;
    }

    const remote = await fetchText(`${PROMPTS_BASE}/${filename}`);
    if (remote) {
      prompts[key] = remote;
      continue;
    }

    if (existsSync(localPath)) {
      prompts[key] = await readFile(localPath, 'utf-8');
    } else {
      errors.push(`Could not load prompt: ${filename}`);
    }
  }

  return prompts;
}

async function main() {
  const errors = [];
  await mkdir(USER_DIR, { recursive: true });
  await mkdir(ARCHIVE_DIR, { recursive: true });
  await mkdir(RAW_ARCHIVE_DIR, { recursive: true });
  await mkdir(DIGEST_ARCHIVE_DIR, { recursive: true });

  let config = {
    language: 'zh',
    frequency: 'daily',
    delivery: { method: 'stdout' }
  };

  if (existsSync(CONFIG_PATH)) {
    try {
      config = JSON.parse(await readFile(CONFIG_PATH, 'utf-8'));
    } catch (err) {
      errors.push(`Could not read config: ${err.message}`);
    }
  } else {
    await writeFile(CONFIG_PATH, JSON.stringify(config, null, 2) + '\n', 'utf-8');
  }

  const [feedX, feedPodcasts] = await Promise.all([
    fetchJSON(FEED_X_URL),
    fetchJSON(FEED_PODCASTS_URL)
  ]);

  if (!feedX) errors.push('Could not fetch tweet feed');
  if (!feedPodcasts) errors.push('Could not fetch podcast feed');

  const now = new Date();
  const dateParts = formatDateParts(now);

  const rawArchive = {
    status: 'ok',
    generatedAt: now.toISOString(),
    date: dateParts.dashed,
    sources: {
      feedXUrl: FEED_X_URL,
      feedPodcastsUrl: FEED_PODCASTS_URL
    },
    feedGeneratedAt: {
      x: feedX?.generatedAt || null,
      podcasts: feedPodcasts?.generatedAt || null
    },
    raw: {
      x: feedX?.x || [],
      podcasts: feedPodcasts?.podcasts || []
    }
  };
  const rawArchivePath = join(RAW_ARCHIVE_DIR, `${dateParts.dashed}.json`);
  await writeFile(rawArchivePath, JSON.stringify(rawArchive, null, 2) + '\n', 'utf-8');

  const prompts = await loadPrompts(errors);

  let nextIndex = 1;

  const x = (feedX?.x || []).map((builder) => ({
    ...builder,
    id: buildStableId(dateParts.compact, nextIndex++)
  }));

  const podcasts = (feedPodcasts?.podcasts || []).map((podcast) => ({
    ...podcast,
    id: buildStableId(dateParts.compact, nextIndex++)
  }));

  const archive = {
    status: 'ok',
    generatedAt: now.toISOString(),
    date: dateParts.dashed,
    items: [
      ...x.map((builder) => makeArchiveEntryFromBuilder(builder, dateParts.dashed)),
      ...podcasts.map((podcast) => makeArchiveEntryFromPodcast(podcast, dateParts.dashed))
    ]
  };

  const archivePath = join(DIGEST_ARCHIVE_DIR, `${dateParts.dashed}.json`);
  await writeFile(archivePath, JSON.stringify(archive, null, 2) + '\n', 'utf-8');

  const output = {
    status: 'ok',
    generatedAt: now.toISOString(),
    config: {
      language: config.language || 'zh',
      frequency: config.frequency || 'daily',
      delivery: config.delivery || { method: 'stdout' }
    },
    archive: {
      date: dateParts.dashed,
      path: archivePath
    },
    rawArchive: {
      date: dateParts.dashed,
      path: rawArchivePath
    },
    podcasts,
    x,
    stats: {
      podcastEpisodes: podcasts.length,
      xBuilders: x.length,
      totalTweets: x.reduce((sum, builder) => sum + builder.tweets.length, 0),
      feedGeneratedAt: feedX?.generatedAt || feedPodcasts?.generatedAt || null
    },
    prompts,
    errors: errors.length > 0 ? errors : undefined
  };

  console.log(JSON.stringify(output, null, 2));
}

main().catch((err) => {
  console.error(JSON.stringify({
    status: 'error',
    message: err.message
  }));
  process.exit(1);
});
