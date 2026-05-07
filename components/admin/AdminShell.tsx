'use client';

import { useEffect, useState } from 'react';
import { readJson } from '@/lib/admin/github';
import { clearToken } from '@/lib/admin/storage';
import { ContactTab, type SeoFile } from './ContactTab';
import { HoursTab, type HoursFile } from './HoursTab';
import { MenuTab, type MenuFile } from './MenuTab';
import { GalleryTab, type GalleryFile, type PendingImage } from './GalleryTab';
import { PublishDialog } from './PublishDialog';

const FILE_PATHS = {
  seo: 'content/seo.json',
  hours: 'content/hours.json',
  menu: 'content/menu.json',
  gallery: 'content/gallery.json',
} as const;

type TabKey = 'contact' | 'hours' | 'menu' | 'gallery';

const TABS: Array<{ key: TabKey; label: string }> = [
  { key: 'contact', label: 'Contact & links' },
  { key: 'hours', label: 'Hours' },
  { key: 'menu', label: 'Menu' },
  { key: 'gallery', label: 'Gallery' },
];

export function AdminShell({ token, login, onSignOut }: { token: string; login: string; onSignOut: () => void }) {
  const [active, setActive] = useState<TabKey>('contact');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Originals — fetched from main on mount, never mutated.
  const [origSeo, setOrigSeo] = useState<SeoFile | null>(null);
  const [origHours, setOrigHours] = useState<HoursFile | null>(null);
  const [origMenu, setOrigMenu] = useState<MenuFile | null>(null);
  const [origGallery, setOrigGallery] = useState<GalleryFile | null>(null);

  // Drafts — what the owner is editing.
  const [seo, setSeo] = useState<SeoFile | null>(null);
  const [hours, setHours] = useState<HoursFile | null>(null);
  const [menu, setMenu] = useState<MenuFile | null>(null);
  const [gallery, setGallery] = useState<GalleryFile | null>(null);

  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const [showPublish, setShowPublish] = useState(false);
  const [lastCommit, setLastCommit] = useState<string | null>(null);

  useEffect(() => {
    let aborted = false;
    (async () => {
      try {
        const [seoRes, hoursRes, menuRes, galleryRes] = await Promise.all([
          readJson<SeoFile>(FILE_PATHS.seo, token),
          readJson<HoursFile>(FILE_PATHS.hours, token),
          readJson<MenuFile>(FILE_PATHS.menu, token),
          readJson<GalleryFile>(FILE_PATHS.gallery, token),
        ]);
        if (aborted) return;
        setOrigSeo(seoRes.content);
        setSeo(structuredClone(seoRes.content));
        setOrigHours(hoursRes.content);
        setHours(structuredClone(hoursRes.content));
        setOrigMenu(menuRes.content);
        setMenu(structuredClone(menuRes.content));
        setOrigGallery(galleryRes.content);
        setGallery(structuredClone(galleryRes.content));
      } catch (err) {
        if (aborted) return;
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        if (!aborted) setLoading(false);
      }
    })();
    return () => {
      aborted = true;
    };
  }, [token]);

  const dirty = (a: unknown, b: unknown) => JSON.stringify(a) !== JSON.stringify(b);
  const totalDirtyFiles =
    (seo && origSeo && dirty(seo, origSeo) ? 1 : 0) +
    (hours && origHours && dirty(hours, origHours) ? 1 : 0) +
    (menu && origMenu && dirty(menu, origMenu) ? 1 : 0) +
    (gallery && origGallery && dirty(gallery, origGallery) ? 1 : 0) +
    pendingImages.length;

  // Warn before navigating away with unsaved changes.
  useEffect(() => {
    if (totalDirtyFiles === 0) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [totalDirtyFiles]);

  const signOut = () => {
    if (totalDirtyFiles > 0 && !confirm('You have unsaved changes. Sign out anyway?')) return;
    clearToken();
    onSignOut();
  };

  return (
    <div className="min-h-screen bg-ink">
      <header className="sticky top-0 z-30 border-b border-paper/15 bg-ink">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-baseline gap-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/65">
              The Civil · Owner
            </p>
            <p className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-paper/45 sm:inline">
              · {login}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {totalDirtyFiles > 0 && (
              <span className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-brass sm:inline">
                {totalDirtyFiles} unsaved
              </span>
            )}
            <button
              type="button"
              onClick={() => setShowPublish(true)}
              disabled={totalDirtyFiles === 0}
              className="btn-ember px-4 py-2 text-[11px] disabled:opacity-40"
            >
              Publish ({totalDirtyFiles})
            </button>
            <button
              type="button"
              onClick={signOut}
              className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/65 hover:text-paper"
            >
              Sign out
            </button>
          </div>
        </div>

        <nav className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 pb-3 sm:px-6">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setActive(t.key)}
              className={
                'pill shrink-0 transition-colors ' +
                (active === t.key
                  ? 'border-paper bg-paper text-ink'
                  : 'border-paper/30 text-paper/85 hover:text-paper')
              }
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {loading && <p className="font-mono text-sm text-paper/65">Loading content from {`${' '}main `} …</p>}
        {error && (
          <p
            role="alert"
            className="rounded-md border border-ember/60 bg-ember/10 px-4 py-3 font-mono text-sm text-ember"
          >
            {error}
          </p>
        )}
        {lastCommit && (
          <p className="mb-4 rounded-md border border-basil/60 bg-basil/10 px-4 py-3 font-mono text-sm text-basil">
            Published. CI is now building →{' '}
            <a
              href={`https://github.com/Gabriel-Gabrie/thecivilpizza/commit/${lastCommit}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-4 hover:underline"
            >
              view commit
            </a>
            . Live in ~90s.
          </p>
        )}

        {!loading && !error && (
          <div>
            {active === 'contact' && seo && origSeo && (
              <ContactTab draft={seo} original={origSeo} setDraft={setSeo} />
            )}
            {active === 'hours' && hours && origHours && (
              <HoursTab draft={hours} original={origHours} setDraft={setHours} />
            )}
            {active === 'menu' && menu && origMenu && (
              <MenuTab draft={menu} original={origMenu} setDraft={setMenu} />
            )}
            {active === 'gallery' && gallery && origGallery && (
              <GalleryTab
                draft={gallery}
                original={origGallery}
                setDraft={setGallery}
                pendingImages={pendingImages}
                setPendingImages={setPendingImages}
              />
            )}
          </div>
        )}
      </main>

      {showPublish && seo && hours && menu && gallery && origSeo && origHours && origMenu && origGallery && (
        <PublishDialog
          token={token}
          drafts={{
            [FILE_PATHS.seo]: seo,
            [FILE_PATHS.hours]: hours,
            [FILE_PATHS.menu]: menu,
            [FILE_PATHS.gallery]: gallery,
          }}
          originals={{
            [FILE_PATHS.seo]: origSeo,
            [FILE_PATHS.hours]: origHours,
            [FILE_PATHS.menu]: origMenu,
            [FILE_PATHS.gallery]: origGallery,
          }}
          pendingImages={pendingImages}
          onClose={() => setShowPublish(false)}
          onPublished={(sha) => {
            // After a successful commit, the live "originals" are the new draft state.
            setOrigSeo(structuredClone(seo));
            setOrigHours(structuredClone(hours));
            setOrigMenu(structuredClone(menu));
            setOrigGallery(structuredClone(gallery));
            setPendingImages([]);
            setLastCommit(sha);
            setShowPublish(false);
          }}
        />
      )}
    </div>
  );
}
