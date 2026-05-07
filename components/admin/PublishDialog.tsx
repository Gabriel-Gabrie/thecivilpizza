'use client';

import { useState } from 'react';
import { commitBatch, jsonToText, type FileEdit } from '@/lib/admin/github';
import type { PendingImage } from './GalleryTab';

// Friendly labels for the underlying data files. Owners shouldn't have
// to read repo paths.
const SECTION_LABELS: Record<string, string> = {
  'content/seo.json': 'Contact & links',
  'content/menu.json': 'Menu',
  'content/hours.json': 'Hours',
  'content/gallery.json': 'Gallery',
};

function friendlyPath(path: string): string {
  if (SECTION_LABELS[path]) return SECTION_LABELS[path];
  if (path.startsWith('public/images/')) {
    return `Image: ${path.slice('public/images/'.length)}`;
  }
  return path;
}

type DiffSummary = {
  filePath: string;
  status: 'modified' | 'new';
  notes: string[];
};

export function PublishDialog({
  token,
  drafts,
  originals,
  pendingImages,
  onClose,
  onPublished,
}: {
  token: string;
  drafts: Record<string, unknown>;
  originals: Record<string, unknown>;
  pendingImages: PendingImage[];
  onClose: () => void;
  onPublished: (newCommitSha: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changes: DiffSummary[] = [];
  for (const [filePath, draft] of Object.entries(drafts)) {
    const original = originals[filePath];
    if (JSON.stringify(draft) === JSON.stringify(original)) continue;
    changes.push({
      filePath,
      status: 'modified',
      notes: summarizeJsonChange(draft, original),
    });
  }
  for (const img of pendingImages) {
    changes.push({
      filePath: img.path,
      status: 'new',
      notes: [`upload ${img.filename}`],
    });
  }

  const publish = async () => {
    setBusy(true);
    setError(null);
    try {
      const edits: FileEdit[] = [];
      for (const [filePath, draft] of Object.entries(drafts)) {
        if (JSON.stringify(draft) === JSON.stringify(originals[filePath])) continue;
        edits.push({ type: 'text', path: filePath, content: jsonToText(draft) });
      }
      for (const img of pendingImages) {
        edits.push({
          type: 'binary',
          path: img.path,
          contentBase64: img.contentBase64,
        });
      }
      if (edits.length === 0) throw new Error('Nothing to save yet.');
      const sha = await commitBatch(token, edits, `content: edits via /admin`);
      onPublished(sha);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong saving. Please try again."
      );
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 p-4 sm:items-center">
      <div className="w-full max-w-2xl overflow-hidden rounded-lg bg-paper shadow-2xl">
        <header className="border-b border-ink/10 px-6 py-5">
          <p className="text-sm font-medium text-ink/65">Review</p>
          <h2 className="mt-1 text-xl font-semibold text-ink">
            {changes.length === 1
              ? '1 area of the site will be updated'
              : `${changes.length} areas of the site will be updated`}
          </h2>
        </header>

        <div className="max-h-[55vh] overflow-y-auto px-6 py-5">
          {changes.length === 0 ? (
            <p className="text-sm text-ink/65">No pending changes.</p>
          ) : (
            <ul className="space-y-4">
              {changes.map((c) => (
                <li key={c.filePath} className="border-b border-ink/10 pb-4 last:border-0 last:pb-0">
                  <p className="text-sm">
                    <span
                      className={
                        'rounded px-2 py-0.5 text-xs font-medium ' +
                        (c.status === 'new'
                          ? 'bg-basil/20 text-ink'
                          : 'bg-brass/20 text-ink')
                      }
                    >
                      {c.status === 'new' ? 'new' : 'edited'}
                    </span>{' '}
                    <span className="text-sm font-medium text-ink">
                      {friendlyPath(c.filePath)}
                    </span>
                  </p>
                  {c.notes.length > 0 && (
                    <ul className="mt-2 space-y-1 pl-4">
                      {c.notes.slice(0, 12).map((n, i) => (
                        <li key={i} className="font-mono text-xs text-ink/65">
                          {n}
                        </li>
                      ))}
                      {c.notes.length > 12 && (
                        <li className="text-xs text-ink/45">
                          + {c.notes.length - 12} more
                        </li>
                      )}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-ink/10 bg-paper-2/40 px-6 py-5">
          {error && (
            <p
              role="alert"
              className="mb-3 rounded-md border border-ember/40 bg-ember/10 px-3.5 py-2.5 text-sm text-ember"
            >
              {error}
            </p>
          )}
          <div className="flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-md border border-ink/25 bg-white px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-ink/5"
            >
              Keep editing
            </button>
            <button
              type="button"
              onClick={publish}
              disabled={busy || changes.length === 0}
              className="inline-flex items-center justify-center rounded-md bg-ember px-5 py-2.5 text-sm font-medium text-paper transition hover:bg-ember/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? 'Saving…' : 'Save and update site'}
            </button>
          </div>
          <p className="mt-3 text-xs text-ink/55">
            Your changes should appear on the live site in about a minute.
          </p>
        </div>
      </div>
    </div>
  );
}

function summarizeJsonChange(draft: unknown, original: unknown): string[] {
  const notes: string[] = [];
  if (typeof draft !== 'object' || draft === null) return notes;
  if (typeof original !== 'object' || original === null) return notes;
  const a = draft as Record<string, unknown>;
  const b = original as Record<string, unknown>;
  for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
    const av = a[key];
    const bv = b[key];
    if (JSON.stringify(av) === JSON.stringify(bv)) continue;
    if (Array.isArray(av) && Array.isArray(bv)) {
      const idA = (x: unknown) =>
        (x as Record<string, unknown>)?.slug ?? (x as Record<string, unknown>)?.id;
      const aMap = new Map(av.map((x) => [idA(x), x]));
      const bMap = new Map(bv.map((x) => [idA(x), x]));
      for (const [id, item] of aMap) {
        if (!id) continue;
        if (!bMap.has(id)) notes.push(`added ${id}`);
        else if (JSON.stringify(item) !== JSON.stringify(bMap.get(id)))
          notes.push(`updated ${id}`);
      }
      for (const [id] of bMap) {
        if (id && !aMap.has(id)) notes.push(`removed ${id}`);
      }
    } else if (typeof av === 'object' && typeof bv === 'object') {
      const subNotes = summarizeJsonChange(av, bv);
      for (const n of subNotes) notes.push(`${key}: ${n}`);
    } else {
      notes.push(`${humanizeKey(key)}: ${truncate(bv)} → ${truncate(av)}`);
    }
  }
  return notes;
}

function humanizeKey(key: string): string {
  // Convert camelCase / kebab to Title Case for friendlier diff lines.
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/[-_]/g, ' ')
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

function truncate(v: unknown): string {
  const s = typeof v === 'string' ? v : JSON.stringify(v);
  if (!s) return 'empty';
  return s.length > 40 ? s.slice(0, 37) + '…' : s;
}
