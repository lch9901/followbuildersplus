#!/usr/bin/env node

import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { homedir } from 'os';

const USER_DIR = join(homedir(), '.followbuildersplus');
const ARCHIVE_DIR = join(USER_DIR, 'archive', 'digest');

function normalizeId(value) {
  const raw = String(value || '').trim();
  return /^fb\d{11}$/i.test(raw) ? raw.toUpperCase() : null;
}

async function main() {
  const id = normalizeId(process.argv[2]);
  if (!id) {
    console.log(JSON.stringify({ status: 'invalid_id' }, null, 2));
    return;
  }

  const datePart = id.slice(2, 10);
  const archiveName = `${datePart.slice(0, 4)}-${datePart.slice(4, 6)}-${datePart.slice(6, 8)}.json`;
  const archivePath = join(ARCHIVE_DIR, archiveName);

  if (!existsSync(archivePath)) {
    console.log(JSON.stringify({ status: 'not_found', id }, null, 2));
    return;
  }

  const archive = JSON.parse(await readFile(archivePath, 'utf-8'));
  const item = (archive.items || []).find((entry) => String(entry.id).toUpperCase() === id);

  if (!item) {
    console.log(JSON.stringify({ status: 'not_found', id }, null, 2));
    return;
  }

  console.log(JSON.stringify({ status: 'ok', id, archivePath, item }, null, 2));
}

main().catch((err) => {
  console.error(JSON.stringify({ status: 'error', message: err.message }));
  process.exit(1);
});
