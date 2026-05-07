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

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
    <div className="space-y-8">
      <section>
        <h2 className="font-display text-2xl font-black italic">Weekly hours</h2>
        <p className="dek mt-1 text-base">
          Times in 24-hour format, e.g. 17:00 = 5pm. Add a second range for split shifts.
          Leave a day empty (no ranges) to mark it closed.
        </p>
        <div className="mt-6 space-y-3">
          {draft.schedule.map((day) => {
            const origDay = original.schedule.find((d) => d.day === day.day);
            const isDirty = dirty(day, origDay);
            return (
              <div
                key={day.day}
                className={
                  'rounded-md border p-4 ' +
                  (isDirty ? 'border-brass' : 'border-paper/15')
                }
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-paper">
                    {DAY_LABELS[day.day]}
                  </span>
                  <button
                    type="button"
                    onClick={() => addRange(day.day)}
                    className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/70 hover:text-paper"
                  >
                    + add range
                  </button>
                </div>
                {day.ranges.length === 0 && (
                  <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-paper/55">
                    Closed
                  </p>
                )}
                {day.ranges.map((r, i) => (
                  <div key={i} className="mt-3 flex items-center gap-2">
                    <input
                      type="time"
                      value={r.open}
                      onChange={(e) => setRange(day.day, i, 'open', e.target.value)}
                      className="rounded border border-paper/25 bg-ink/60 px-3 py-1.5 font-mono text-sm text-paper"
                    />
                    <span className="font-mono text-paper/50">→</span>
                    <input
                      type="time"
                      value={r.close}
                      onChange={(e) => setRange(day.day, i, 'close', e.target.value)}
                      className="rounded border border-paper/25 bg-ink/60 px-3 py-1.5 font-mono text-sm text-paper"
                    />
                    <button
                      type="button"
                      onClick={() => removeRange(day.day, i)}
                      className="ml-auto font-mono text-[10px] uppercase tracking-[0.2em] text-ember/80 hover:text-ember"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl font-black italic">Lunch window</h2>
        <p className="dek mt-1 text-base">
          A separate "Lunch served Wed–Sat 12pm–4pm" type message appears below the hours table.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
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
      </section>
    </div>
  );
}
