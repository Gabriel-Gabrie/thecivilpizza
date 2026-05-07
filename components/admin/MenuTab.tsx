'use client';

import { useState } from 'react';
import { Field } from './Field';

export type MenuItem = {
  slug: string;
  name: string;
  dek: string;
  ingredients: string[];
  price: string;
  tags?: string[];
};

export type MenuSection = {
  heading: string;
  items: MenuItem[];
};

export type MenuFile = {
  _source?: string;
  starters: MenuSection;
  pizzas: MenuSection;
  cocktails: MenuSection;
  flights: MenuSection;
  beerWine: MenuSection;
  lunch: MenuSection;
};

const SECTION_KEYS: Array<keyof Omit<MenuFile, '_source'>> = [
  'pizzas',
  'starters',
  'cocktails',
  'flights',
  'beerWine',
  'lunch',
];

const SECTION_LABELS: Record<string, string> = {
  pizzas: 'Pies',
  starters: 'Starters',
  cocktails: 'Cocktails',
  flights: 'Flights',
  beerWine: 'Beer & Wine',
  lunch: 'Lunch menu',
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

function ensureUniqueSlug(base: string, existing: string[]): string {
  let candidate = base || 'item';
  let n = 1;
  while (existing.includes(candidate)) {
    n += 1;
    candidate = `${base || 'item'}-${n}`;
  }
  return candidate;
}

export function MenuTab({
  draft,
  original,
  setDraft,
}: {
  draft: MenuFile;
  original: MenuFile;
  setDraft: (next: MenuFile) => void;
}) {
  const [activeSection, setActiveSection] = useState<keyof MenuFile>('pizzas');

  const dirty = (a: unknown, b: unknown) => JSON.stringify(a) !== JSON.stringify(b);

  const updateSection = (key: keyof MenuFile, items: MenuItem[]) => {
    const section = draft[key] as MenuSection;
    setDraft({ ...draft, [key]: { ...section, items } });
  };

  const updateItem = (
    sectionKey: keyof MenuFile,
    index: number,
    patch: Partial<MenuItem>
  ) => {
    const section = draft[sectionKey] as MenuSection;
    const next = section.items.map((it, i) => (i === index ? { ...it, ...patch } : it));
    updateSection(sectionKey, next);
  };

  const removeItem = (sectionKey: keyof MenuFile, index: number) => {
    const section = draft[sectionKey] as MenuSection;
    if (!confirm(`Remove "${section.items[index]?.name}"?`)) return;
    updateSection(
      sectionKey,
      section.items.filter((_, i) => i !== index)
    );
  };

  const moveItem = (sectionKey: keyof MenuFile, index: number, dir: -1 | 1) => {
    const section = draft[sectionKey] as MenuSection;
    const target = index + dir;
    if (target < 0 || target >= section.items.length) return;
    const next = [...section.items];
    const tmp = next[index]!;
    next[index] = next[target]!;
    next[target] = tmp;
    updateSection(sectionKey, next);
  };

  const addItem = (sectionKey: keyof MenuFile) => {
    const section = draft[sectionKey] as MenuSection;
    const slug = ensureUniqueSlug('new-item', section.items.map((i) => i.slug));
    const newItem: MenuItem = {
      slug,
      name: 'New item',
      dek: '',
      ingredients: [],
      price: '$0',
      tags: [],
    };
    updateSection(sectionKey, [...section.items, newItem]);
  };

  const renameItem = (sectionKey: keyof MenuFile, index: number, name: string) => {
    const section = draft[sectionKey] as MenuSection;
    const item = section.items[index];
    if (!item) return;
    const oldSlug = item.slug;
    const oldDerived = slugify(item.name);
    const shouldRegen = oldSlug === oldDerived || oldSlug.startsWith('new-item');
    let nextSlug = oldSlug;
    if (shouldRegen) {
      const otherSlugs = section.items
        .filter((_, i) => i !== index)
        .map((i) => i.slug);
      nextSlug = ensureUniqueSlug(slugify(name), otherSlugs);
    }
    updateItem(sectionKey, index, { name, slug: nextSlug });
  };

  const section = draft[activeSection] as MenuSection;
  const origSection = original[activeSection] as MenuSection;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-ink/10 bg-white p-2">
        {SECTION_KEYS.map((key) => {
          const isActive = activeSection === key;
          const sec = draft[key] as MenuSection;
          const origSec = original[key] as MenuSection;
          const isDirty = dirty(sec, origSec);
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActiveSection(key)}
              className={
                'rounded-md px-3 py-2 text-sm transition-colors ' +
                (isActive
                  ? 'bg-ink text-paper'
                  : 'text-ink/70 hover:bg-ink/5')
              }
            >
              <span className="font-medium">{SECTION_LABELS[key]}</span>
              <span className={isActive ? 'ml-1 opacity-70' : 'ml-1 text-ink/45'}>
                · {sec.items.length}
              </span>
              {isDirty && !isActive && (
                <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-brass" />
              )}
            </button>
          );
        })}
      </div>

      <section className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-ink">
          {SECTION_LABELS[activeSection as string]}
        </h2>
        <p className="mt-1 text-sm text-ink/65">
          {section.items.length} item{section.items.length === 1 ? '' : 's'} in this section.
        </p>

        <div className="mt-4 max-w-md">
          <Field
            label="Section heading (shown on /menu)"
            value={section.heading}
            onChange={(v) =>
              setDraft({
                ...draft,
                [activeSection]: { ...section, heading: v },
              })
            }
            dirty={dirty(section.heading, origSection.heading)}
          />
        </div>

        <ul className="mt-6 space-y-4">
          {section.items.map((item, idx) => {
            const orig = origSection.items.find((o) => o.slug === item.slug);
            const isDirty = !orig || dirty(item, orig);
            const isNew = !orig;
            return (
              <li
                key={item.slug}
                className={
                  'rounded-md border p-5 ' +
                  (isDirty
                    ? 'border-brass bg-brass/5'
                    : 'border-ink/10 bg-paper-2/20')
                }
              >
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span className="text-sm text-ink/60">
                    #{idx + 1} · <span className="font-mono text-xs">{item.slug}</span>
                    {isNew && (
                      <span className="ml-2 rounded-full bg-basil/20 px-2 py-0.5 text-xs font-medium text-ink">
                        new
                      </span>
                    )}
                  </span>
                  <div className="ml-auto flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => moveItem(activeSection, idx, -1)}
                      disabled={idx === 0}
                      aria-label="Move up"
                      className="rounded border border-ink/15 px-2 py-1 text-sm text-ink/70 hover:bg-ink/5 disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveItem(activeSection, idx, 1)}
                      disabled={idx === section.items.length - 1}
                      aria-label="Move down"
                      className="rounded border border-ink/15 px-2 py-1 text-sm text-ink/70 hover:bg-ink/5 disabled:opacity-30"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(activeSection, idx)}
                      className="ml-2 text-sm text-ember/85 hover:text-ember"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Name"
                    value={item.name}
                    onChange={(v) => renameItem(activeSection, idx, v)}
                  />
                  <Field
                    label="Price"
                    value={item.price}
                    onChange={(v) => updateItem(activeSection, idx, { price: v })}
                    placeholder="$20"
                  />
                  <div className="sm:col-span-2">
                    <Field
                      label="Tagline / dek"
                      value={item.dek}
                      onChange={(v) => updateItem(activeSection, idx, { dek: v })}
                      multiline
                      rows={2}
                      placeholder="A felony of flavor. Three counts on the indictment."
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Field
                      label="Ingredients (comma-separated)"
                      value={item.ingredients.join(', ')}
                      onChange={(v) =>
                        updateItem(activeSection, idx, {
                          ingredients: v
                            .split(',')
                            .map((s) => s.trim())
                            .filter(Boolean),
                        })
                      }
                      placeholder="ricotta, prosciutto, pear, gorgonzola"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Field
                      label="Tags (comma-separated)"
                      value={(item.tags ?? []).join(', ')}
                      onChange={(v) =>
                        updateItem(activeSection, idx, {
                          tags: v
                            .split(',')
                            .map((s) => s.trim())
                            .filter(Boolean),
                        })
                      }
                      placeholder="meaty, spicy, sweet"
                      helper={
                        'Used by the menu page filters. Common values: veggie, meaty, spicy, sweet, dine-in-only.'
                      }
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          onClick={() => addItem(activeSection)}
          className="mt-6 inline-flex items-center justify-center rounded-md border border-ink/25 bg-white px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-ink/5"
        >
          + Add item to {SECTION_LABELS[activeSection as string]}
        </button>
      </section>
    </div>
  );
}
