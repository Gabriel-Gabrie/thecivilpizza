'use client';

import { useRef, useState } from 'react';
import { Field } from './Field';
import { fileToBase64 } from '@/lib/admin/github';
import { withBase } from '@/lib/url';

export type GalleryItem = {
  id: string;
  category: string;
  alt: string;
  src: string;
  feature?: boolean;
};

export type GalleryFile = {
  _source?: string;
  _categorization?: string;
  items: GalleryItem[];
};

export type PendingImage = {
  /** Repo path the image will be committed to (e.g. "public/images/foo.jpg"). */
  path: string;
  /** Base64 contents (no data: prefix) for the GitHub blob upload. */
  contentBase64: string;
  /** Local data URL for previewing in the admin before publish. */
  previewDataUrl: string;
  /** What the file is called locally — for friendly display. */
  filename: string;
};

const CATEGORIES = ['interior', 'exterior', 'pies', 'cocktails', 'flights', 'feature-only'];

function slugifyName(name: string): string {
  const base = name.toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/^-+|-+$/g, '');
  return base || 'image';
}

export function GalleryTab({
  draft,
  original,
  setDraft,
  pendingImages,
  setPendingImages,
}: {
  draft: GalleryFile;
  original: GalleryFile;
  setDraft: (next: GalleryFile) => void;
  pendingImages: PendingImage[];
  setPendingImages: (next: PendingImage[]) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

  const dirty = (a: unknown, b: unknown) => JSON.stringify(a) !== JSON.stringify(b);

  const updateItem = (index: number, patch: Partial<GalleryItem>) => {
    const next = draft.items.map((it, i) => (i === index ? { ...it, ...patch } : it));
    setDraft({ ...draft, items: next });
  };

  const removeItem = (index: number) => {
    if (!confirm(`Remove "${draft.items[index]?.id}" from the gallery?`)) return;
    setDraft({ ...draft, items: draft.items.filter((_, i) => i !== index) });
  };

  const onFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    try {
      const newPending: PendingImage[] = [];
      const newItems: GalleryItem[] = [];
      for (const file of Array.from(fileList)) {
        const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
        const baseName = slugifyName(file.name.replace(/\.[^.]+$/, ''));
        const filename = `${baseName}.${ext}`;
        const contentBase64 = await fileToBase64(file);
        const previewDataUrl = await readAsDataUrl(file);
        const path = `public/images/${filename}`;
        newPending.push({ path, contentBase64, previewDataUrl, filename });
        newItems.push({
          id: baseName,
          category: 'pies',
          alt: '',
          src: `/images/${filename}`,
        });
      }
      setPendingImages([...pendingImages, ...newPending]);
      setDraft({ ...draft, items: [...draft.items, ...newItems] });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <section>
        <h2 className="font-display text-2xl font-black italic">Upload images</h2>
        <p className="dek mt-1 text-base">
          Pick one or more files. They show up at the bottom of the list as drafts;
          publish to commit them and add their entries to the gallery.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            multiple
            onChange={(e) => onFiles(e.target.files)}
            className="hidden"
            id="admin-image-upload"
          />
          <label htmlFor="admin-image-upload" className="btn-ember cursor-pointer">
            {uploading ? 'Reading…' : 'Choose images'}
          </label>
          {pendingImages.length > 0 && (
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-brass">
              {pendingImages.length} new image{pendingImages.length === 1 ? '' : 's'} pending
            </span>
          )}
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl font-black italic">
          All photos <span className="text-paper/55">· {draft.items.length}</span>
        </h2>

        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {draft.items.map((item, idx) => {
            const orig = original.items.find((o) => o.id === item.id);
            const isDirty = !orig || dirty(item, orig);
            const isNew = !orig;
            const pending = pendingImages.find((p) => p.path === `public${item.src}`);
            // For pending uploads, use the preview data URL; otherwise the live URL.
            const previewSrc = pending ? pending.previewDataUrl : withBase(item.src);
            return (
              <li
                key={item.id + idx}
                className={
                  'rounded-md border p-3 ' +
                  (isDirty ? 'border-brass' : 'border-paper/15')
                }
              >
                <div className="relative aspect-[4/5] overflow-hidden border border-paper/10 bg-ink">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewSrc}
                    alt={item.alt}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  {(isNew || pending) && (
                    <span className="absolute left-2 top-2 rounded-full bg-basil/90 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-paper">
                      {pending ? 'uploading' : 'new'}
                    </span>
                  )}
                </div>
                <p className="mt-2 truncate font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55">
                  {item.id}
                </p>

                <div className="mt-2 space-y-2">
                  <Field
                    label="ID (used as React key)"
                    value={item.id}
                    onChange={(v) => updateItem(idx, { id: v })}
                    monospace
                  />
                  <label className="block">
                    <span className="kicker">Category</span>
                    <select
                      value={item.category}
                      onChange={(e) => updateItem(idx, { category: e.target.value })}
                      className="mt-1.5 block w-full rounded-md border border-paper/25 bg-ink/60 px-3 py-2 font-mono text-sm text-paper focus:border-paper/70 focus:outline-none"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </label>
                  <Field
                    label="Alt text"
                    value={item.alt}
                    onChange={(v) => updateItem(idx, { alt: v })}
                    multiline
                    rows={2}
                  />
                  <label className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-paper/85">
                    <input
                      type="checkbox"
                      checked={Boolean(item.feature)}
                      onChange={(e) =>
                        updateItem(idx, { feature: e.target.checked || undefined })
                      }
                    />
                    Feature on /gallery hero row
                  </label>
                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    className="font-mono text-[10px] uppercase tracking-[0.2em] text-ember/80 hover:text-ember"
                  >
                    Remove
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
