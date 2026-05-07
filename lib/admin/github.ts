// Thin GitHub REST API wrapper for the admin page. Uses the user's
// fine-grained PAT to read content from main and batch-commit edits via
// the Git Trees API.
//
// Why the Trees API instead of the simpler Contents API: a single edit
// session can touch a bunch of files (seo.json, menu.json, gallery.json,
// plus uploaded images). Doing one Contents-API PUT per file means N
// commits, N CI builds, N deploys. The Trees API lets us pack the whole
// edit session into a single commit.

const REPO_OWNER = 'Gabriel-Gabrie';
const REPO_NAME = 'thecivilpizza';
const BRANCH = 'main';
const API = 'https://api.github.com';

type Token = string;

class GitHubError extends Error {
  constructor(public status: number, public body: string) {
    super(`GitHub API ${status}: ${body.slice(0, 240)}`);
  }
}

async function gh(
  path: string,
  token: Token,
  init?: RequestInit
): Promise<unknown> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(init?.headers ?? {}),
    },
  });
  const text = await res.text();
  if (!res.ok) throw new GitHubError(res.status, text);
  return text ? JSON.parse(text) : null;
}

// -- Reads ------------------------------------------------------------------

type ContentsResponse = { content: string; sha: string; encoding: 'base64' };

/** Read a JSON file from the repo. Returns parsed content + the file's SHA. */
export async function readJson<T>(
  filePath: string,
  token: Token
): Promise<{ content: T; sha: string }> {
  const data = (await gh(
    `/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}?ref=${BRANCH}`,
    token
  )) as ContentsResponse;
  // GitHub returns base64 with embedded newlines that atob doesn't like.
  const decoded = decodeBase64(data.content.replace(/\n/g, ''));
  return { content: JSON.parse(decoded) as T, sha: data.sha };
}

/** Verify a token by hitting an authenticated endpoint. Throws on failure. */
export async function verifyToken(token: Token): Promise<{ login: string }> {
  const data = (await gh(`/user`, token)) as { login: string };
  return { login: data.login };
}

/** Confirm the token can write to this repo's contents. Throws on failure. */
export async function verifyRepoAccess(token: Token): Promise<void> {
  const data = (await gh(
    `/repos/${REPO_OWNER}/${REPO_NAME}`,
    token
  )) as { permissions?: { push?: boolean } };
  if (!data.permissions?.push) {
    throw new Error(
      'This token does not have write access to ' +
        `${REPO_OWNER}/${REPO_NAME}. Make sure the PAT has Contents: ` +
        'Read and write permission for this repository.'
    );
  }
}

// -- Writes -----------------------------------------------------------------

export type FileEdit =
  | { type: 'text'; path: string; content: string }
  | { type: 'binary'; path: string; contentBase64: string };

/**
 * Commit a batch of file edits to main as a single commit. Mix of text
 * (JSON files) and binary (uploaded images) is fine. Returns the new
 * commit SHA.
 */
export async function commitBatch(
  token: Token,
  edits: FileEdit[],
  message: string
): Promise<string> {
  if (edits.length === 0) throw new Error('No changes to commit');

  // 1. Resolve current branch HEAD.
  const ref = (await gh(
    `/repos/${REPO_OWNER}/${REPO_NAME}/git/ref/heads/${BRANCH}`,
    token
  )) as { object: { sha: string } };
  const headSha = ref.object.sha;

  const headCommit = (await gh(
    `/repos/${REPO_OWNER}/${REPO_NAME}/git/commits/${headSha}`,
    token
  )) as { tree: { sha: string } };
  const baseTreeSha = headCommit.tree.sha;

  // 2. Build the tree. For text files we can inline `content`; for binary
  //    we need to upload as a blob first and reference its SHA.
  const treeEntries = await Promise.all(
    edits.map(async (e) => {
      if (e.type === 'text') {
        return {
          path: e.path,
          mode: '100644',
          type: 'blob',
          content: e.content,
        };
      }
      const blob = (await gh(
        `/repos/${REPO_OWNER}/${REPO_NAME}/git/blobs`,
        token,
        {
          method: 'POST',
          body: JSON.stringify({
            content: e.contentBase64,
            encoding: 'base64',
          }),
        }
      )) as { sha: string };
      return {
        path: e.path,
        mode: '100644',
        type: 'blob',
        sha: blob.sha,
      };
    })
  );

  const newTree = (await gh(
    `/repos/${REPO_OWNER}/${REPO_NAME}/git/trees`,
    token,
    {
      method: 'POST',
      body: JSON.stringify({ base_tree: baseTreeSha, tree: treeEntries }),
    }
  )) as { sha: string };

  // 3. New commit pointing at the new tree.
  const newCommit = (await gh(
    `/repos/${REPO_OWNER}/${REPO_NAME}/git/commits`,
    token,
    {
      method: 'POST',
      body: JSON.stringify({
        message,
        tree: newTree.sha,
        parents: [headSha],
      }),
    }
  )) as { sha: string };

  // 4. Move the branch ref forward.
  await gh(`/repos/${REPO_OWNER}/${REPO_NAME}/git/refs/heads/${BRANCH}`, token, {
    method: 'PATCH',
    body: JSON.stringify({ sha: newCommit.sha, force: false }),
  });

  return newCommit.sha;
}

// -- Helpers ----------------------------------------------------------------

/** Convert a JS string to a base64 string (for inlining JSON in tree entries). */
export function jsonToText(value: unknown): string {
  return JSON.stringify(value, null, 2) + '\n';
}

/** Read a File as a base64 string (no data: prefix). */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const idx = result.indexOf(',');
      resolve(result.slice(idx + 1));
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function decodeBase64(b64: string): string {
  if (typeof window !== 'undefined' && typeof window.atob === 'function') {
    // atob gives a binary string; decode UTF-8 properly.
    const bin = window.atob(b64);
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    return new TextDecoder('utf-8').decode(bytes);
  }
  // SSR / Node fallback (unused in this codebase but kept for safety).
  return Buffer.from(b64, 'base64').toString('utf-8');
}

export const REPO = `${REPO_OWNER}/${REPO_NAME}`;
export const BRANCH_NAME = BRANCH;
