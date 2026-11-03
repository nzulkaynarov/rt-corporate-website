#!/usr/bin/env node
/**
 * Claude Code PostToolUse hook (see .claude/settings.json).
 * After an agent writes/edits a content file, validate just that file and feed errors back
 * to the agent (exit code 2 → stderr is shown to Claude). Other files are ignored.
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';

let input = '';
process.stdin.on('data', (chunk) => (input += chunk));
process.stdin.on('end', () => {
  let filePath;
  try {
    filePath = JSON.parse(input || '{}')?.tool_input?.file_path;
  } catch {
    process.exit(0);
  }
  if (!filePath) process.exit(0);

  const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();
  const rel = path.relative(root, path.resolve(root, filePath)).split(path.sep).join('/');
  if (!/^src\/(content\/.+\.md|data\/cms\/.+\.json)$/.test(rel)) process.exit(0);

  const run = spawnSync(process.execPath, ['scripts/check-content.mjs', '--files', rel], { cwd: root, encoding: 'utf8' });
  if (run.status === 0) process.exit(0);
  process.stderr.write(
    `check-content found problems in ${rel} (rules: docs/content/README.md). ` +
      `Fix them before finishing the task — intermediate errors while you are still filling translations are expected:\n` +
      `${run.stdout}${run.stderr}`,
  );
  process.exit(2);
});
