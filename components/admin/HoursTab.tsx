'use client';

import { Field } from './Field';

export type Range = { open: string; close: string };
export type DaySchedule = { day: number; label: string; ranges: Range[] };
export type HoursFile = {
  timezone: string;
  schedule: DaySchedule[];
  lunch: { days: number[]; open: string; close: string };
  exceptions: unknown[];
};

const DAY_LABELS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      {description && (
        <p className="mt-1 text-sm text-ink/65">{description}</p>
      )}
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function HoursTab({
  draft,
  original,
  setDraft,
}: {
  draft: HoursFile;
  original: HoursFile;
  setDraft: (next: HoursFile) => void;
}) {
  const dirty = (a: unknown, b: unknown) => JSON.stringify(a) !== JSON.stringify(b);

  const updateDay = (dayIndex: number, ranges: Range[]) => {
    const next = draft.schedule.map((d) => (d.day === dayIndex ? { ...d, ranges } : d));
    setDraft({ ...draft, schedule: next });
  };

  const setRange = (dayIndex: number, rangeIndex: number, key: keyof Range, value: string) => {
    const day = draft.schedule.find((d) => d.day === dayIndex);
    if (!day) return;
    const next = day.ranges.map((r, i) => (i === rangeIndex ? { ...r, [key]: value } : r));
    updateDay(dayIndex, next);
  };

  const addRange = (dayIndex: number) => {
    const day = draft.schedule.find((d) => d.day === dayIndex);
    if (!day) return;
    updateDay(dayIndex, [...day.ranges, { open: '17:00', close: '22:00' }]);
  };

  const removeRange = (dayIndex: number, rangeIndex: number) => {
    const day = draft.schedule.find((d) => d.day === dayIndex);
    if (!day) return;
    updateDay(dayIndex, day.ranges.filter((_, i) => i !== rangeIndex));
  };

  return (
    <div className="space-y-6">
      <Section
        title="Weekly hours"
        description="Times in 24-hour format (e.g. 17:00 = 5pm). Add a second range for split shifts. Leave a day with no ranges to mark it closed."
      >
        <div className="space-y-3">
          {draft.schedule.map((day) => {
            const origDay = original.schedule.find((d) => d.day === day.day);
            const isDirty = dirty(day, origDay);
            return (
              <div
                key={day.day}
                className={
                  'rounded-md border p-4 ' +
                  (isDirty
                    ? 'border-brass bg-brass/5'
                    : 'border-ink/10 bg-paper-2/30')
                }
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-base font-medium text-ink">
                    {DAY_LABELS[day.day]}
                  </span>
                  <button
                    type="button"
                    onClick={() => addRange(day.day)}
                    className="text-sm text-ink/65 hover:text-ink"
                  >
                    + add range
                  </button>
                </div>
                {day.ranges.length === 0 && (
                  <p className="mt-2 text-sm text-ink/55">Closed</p>
                )}
                {day.ranges.map((r, i) => (
                  <div key={i} className="mt-3 flex flex-wrap items-center gap-2">
                    <input
                      type="time"
                      value={r.open}
                      onChange={(e) => setRange(day.day, i, 'open', e.target.value)}
                      className="rounded-md border border-ink/20 bg-white px-3 py-2 text-sm text-ink focus:border-ink/50 focus:outline-none focus:ring-2 focus:ring-ink/20"
                    />
                    <span className="text-ink/40">→</span>
                    <input
                      type="time"
                      value={r.close}
                      onChange={(e) => setRange(day.day, i, 'close', e.target.value)}
                      className="rounded-md border border-ink/20 bg-white px-3 py-2 text-sm text-ink focus:border-ink/50 focus:outline-none focus:ring-2 focus:ring-ink/20"
                    />
                    <button
                      type="button"
                      onClick={() => removeRange(day.day, i)}
                      className="ml-auto text-sm text-ember/85 hover:text-ember"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </Section>

      <Section
        title="Lunch window"
        description="Used in the dek beneath the hours table — e.g. “Lunch served Wed–Sat 12pm–4pm.”"
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <Field
            label="Lunch open"
            value={draft.lunch.open}
            onChange={(v) =>
              setDraft({ ...draft, lunch: { ...draft.lunch, open: v } })
            }
            placeholder="12:00"
            helper="HH:MM, 24-hour."
            dirty={dirty(draft.lunch.open, original.lunch.open)}
          />
          <Field
            label="Lunch close"
            value={draft.lunch.close}
            onChange={(v) =>
              setDraft({ ...draft, lunch: { ...draft.lunch, close: v } })
            }
            placeholder="16:00"
            dirty={dirty(draft.lunch.close, original.lunch.close)}
          />
          <Field
            label="Days (comma-separated, 0=Sun)"
            value={draft.lunch.days.join(',')}
            onChange={(v) => {
              const parsed = v
                .split(',')
                .map((s) => parseInt(s.trim(), 10))
                .filter((n) => !Number.isNaN(n) && n >= 0 && n <= 6);
              setDraft({ ...draft, lunch: { ...draft.lunch, days: parsed } });
            }}
            placeholder="3,4,5,6"
            helper="0=Sun, 1=Mon … 6=Sat. Currently Wed–Sat."
            monospace
            dirty={dirty(draft.lunch.days, original.lunch.days)}
          />
        </div>
      </Section>
    </div>
  );
}
