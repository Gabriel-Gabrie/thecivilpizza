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
  path: string;
  contentBase64: string;
  previewDataUrl: string;
  filename: string;
};

const CATEGORIES = ['interior', 'exterior', 'pies', 'cocktails', 'flights', 'feature-only'];

function slugifyName(name: string): string {
  const base = name.toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/^-+|-+$/g, '');
  return base || 'image';
}

function Section({
  title,
  description,
  right,
  children,
}: {
  title: string;
  description?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-ink">{title}</h2>
          {description && (
            <p className="mt-1 text-sm text-ink/65">{description}</p>
          )}
        </div>
        {right}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
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
      <Section
        title="Upload images"
        description="Pick one or more files. They show up in the list as drafts; click Publish to commit them."
        right={
          pendingImages.length > 0 ? (
            <span className="rounded-full bg-brass/20 px-3 py-1 text-xs font-medium text-ink">
              {pendingImages.length} new image{pendingImages.length === 1 ? '' : 's'} pending
            </span>
          ) : null
        }
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          onChange={(e) => onFiles(e.target.files)}
          className="hidden"
          id="admin-image-upload"
        />
        <label
          htmlFor="admin-image-upload"
          className="inline-flex cursor-pointer items-center justify-center rounded-md bg-ember px-4 py-2.5 text-sm font-medium text-paper transition hover:bg-ember/90"
        >
          {uploading ? 'Reading…' : 'Choose images'}
        </label>
      </Section>

      <Section
        title="All photos"
        description={`${draft.items.length} item${draft.items.length === 1 ? '' : 's'}.`}
      >
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {draft.items.map((item, idx) => {
            const orig = original.items.find((o) => o.id === item.id);
            const isDirty = !orig || dirty(item, orig);
            const isNew = !orig;
            const pending = pendingImages.find((p) => p.path === `public${item.src}`);
            const previewSrc = pending ? pending.previewDataUrl : withBase(item.src);
            return (
              <li
                key={item.id + idx}
                className={
                  'rounded-md border p-3 ' +
                  (isDirty
                    ? 'border-brass bg-brass/5'
                    : 'border-ink/10 bg-paper-2/20')
                }
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded border border-ink/10 bg-ink/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewSrc}
                    alt={item.alt}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  {(isNew || pending) && (
                    <span className="absolute left-2 top-2 rounded-full bg-basil/90 px-2 py-0.5 text-[11px] font-medium text-paper">
                      {pending ? 'uploading' : 'new'}
                    </span>
                  )}
                </div>
                <p className="mt-2 truncate text-sm text-ink/60">{item.id}</p>

                <div className="mt-3 space-y-3">
                  <Field
                    label="ID (used as React key)"
                    value={item.id}
                    onChange={(v) => updateItem(idx, { id: v })}
                    monospace
                  />
                  <label className="block">
                    <span className="text-sm font-medium text-ink">Category</span>
                    <select
                      value={item.category}
                      onChange={(e) => updateItem(idx, { category: e.target.value })}
                      className="mt-1.5 block w-full rounded-md border border-ink/20 bg-white px-3 py-2.5 text-base text-ink focus:border-ink/50 focus:outline-none focus:ring-2 focus:ring-ink/20"
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
                  <label className="flex items-center gap-2 text-sm text-ink/85">
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
                    className="text-sm text-ember/85 hover:text-ember"
                  >
                    Remove
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </Section>
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
