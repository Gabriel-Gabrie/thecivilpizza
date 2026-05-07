'use client';

import { useState } from 'react';
import { commitBatch, jsonToText, type FileEdit } from '@/lib/admin/github';
import type { PendingImage } from './GalleryTab';

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
  const [message, setMessage] = useState('content: edits via /admin');

  // Compute summary of what's changing.
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
      if (edits.length === 0) throw new Error('Nothing to publish.');
      const sha = await commitBatch(token, edits, message || 'content: admin edits');
      onPublished(sha);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/90 p-4 sm:items-center">
      <div className="w-full max-w-2xl overflow-hidden rounded-md border border-paper/25 bg-ink shadow-2xl">
        <header className="border-b border-paper/15 px-5 py-4">
          <p className="kicker">Review changes</p>
          <h2 className="mt-1 font-display text-2xl font-black italic">
            {changes.length} file{changes.length === 1 ? '' : 's'} will be committed
          </h2>
        </header>

        <div className="max-h-[50vh] overflow-y-auto px-5 py-4">
          {changes.length === 0 ? (
            <p className="font-mono text-sm text-paper/65">No pending changes.</p>
          ) : (
            <ul className="space-y-3">
              {changes.map((c) => (
                <li key={c.filePath} className="border-b border-paper/10 pb-3 last:border-0">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/85">
                    <span
                      className={
                        c.status === 'new' ? 'text-basil' : 'text-brass'
                      }
                    >
                      {c.status}
                    </span>{' '}
                    · {c.filePath}
                  </p>
                  {c.notes.length > 0 && (
                    <ul className="mt-1 space-y-0.5 pl-4">
                      {c.notes.slice(0, 12).map((n, i) => (
                        <li key={i} className="font-mono text-[11px] text-paper/65">
                          {n}
                        </li>
                      ))}
                      {c.notes.length > 12 && (
                        <li className="font-mono text-[10px] text-paper/40">
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

        <div className="border-t border-paper/15 px-5 py-4">
          <label className="block">
            <span className="kicker">Commit message</span>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1.5 block w-full rounded-md border border-paper/25 bg-ink/60 px-3 py-2 font-mono text-sm text-paper focus:border-paper/70 focus:outline-none"
            />
          </label>
          {error && (
            <p
              role="alert"
              className="mt-3 rounded-md border border-ember/60 bg-ember/10 px-3 py-2 font-mono text-xs text-ember"
            >
              {error}
            </p>
          )}
          <div className="mt-4 flex flex-wrap items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="btn-paper">
              Cancel
            </button>
            <button
              type="button"
              onClick={publish}
              disabled={busy || changes.length === 0}
              className="btn-ember disabled:opacity-50"
            >
              {busy ? 'Publishing…' : 'Publish to main'}
            </button>
          </div>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-paper/55">
            Commit triggers GitHub Actions → deploy branch → Hostinger pulls (~90s).
          </p>
        </div>
      </div>
    </div>
  );
}

// Build a small list of human-readable bullet points describing what changed
// between two objects. Walks one level deep into arrays of objects keyed by
// `slug` (menu) or `id` (gallery).
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
        if (!bMap.has(id)) notes.push(`${key}: + ${id}`);
        else if (JSON.stringify(item) !== JSON.stringify(bMap.get(id)))
          notes.push(`${key}: ~ ${id}`);
      }
      for (const [id] of bMap) {
        if (id && !aMap.has(id)) notes.push(`${key}: - ${id}`);
      }
    } else if (typeof av === 'object' && typeof bv === 'object') {
      const subNotes = summarizeJsonChange(av, bv);
      for (const n of subNotes) notes.push(`${key}.${n}`);
    } else {
      notes.push(`${key}: ${truncate(bv)} → ${truncate(av)}`);
    }
  }
  return notes;
}

function truncate(v: unknown): string {
  const s = typeof v === 'string' ? v : JSON.stringify(v);
  if (!s) return '∅';
  return s.length > 40 ? s.slice(0, 37) + '…' : s;
}
