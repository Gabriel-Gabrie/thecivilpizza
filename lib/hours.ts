import hoursData from '@/content/hours.json';

type Range = { open: string; close: string };
type Day = { day: number; label: string; ranges: Range[] };

const TZ = hoursData.timezone;

function nowInTZ(now: Date = new Date()): { day: number; minutes: number } {
  // Render a stable representation in the configured timezone.
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const parts = fmt.formatToParts(now);
  const weekday = parts.find((p) => p.type === 'weekday')?.value ?? 'Sun';
  const hour = parseInt(parts.find((p) => p.type === 'hour')?.value ?? '0', 10);
  const minute = parseInt(parts.find((p) => p.type === 'minute')?.value ?? '0', 10);
  const dayMap: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };
  const day = dayMap[weekday] ?? 0;
  return { day, minutes: hour * 60 + minute };
}

function toMinutes(hhmm: string): number {
  const parts = hhmm.split(':');
  const h = parseInt(parts[0] ?? '0', 10);
  const m = parseInt(parts[1] ?? '0', 10);
  return h * 60 + m;
}

function fmtRange(open: string, close: string): string {
  return `${fmtTime(open)}–${fmtTime(close)}`;
}

function fmtTime(hhmm: string): string {
  const parts = hhmm.split(':');
  const h = parseInt(parts[0] ?? '0', 10);
  const m = parseInt(parts[1] ?? '0', 10);
  const period = h >= 12 ? 'pm' : 'am';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${h12}${period}` : `${h12}:${String(m).padStart(2, '0')}${period}`;
}

export type Status =
  | { kind: 'open'; closesAt: string; minutesLeft: number }
  | { kind: 'closing-soon'; closesAt: string; minutesLeft: number }
  | { kind: 'closed'; nextOpen: string; nextDayLabel: string };

export function getStatus(now: Date = new Date()): Status {
  const { day, minutes } = nowInTZ(now);
  const today = (hoursData.schedule as Day[])[day];
  if (today) {
    for (const r of today.ranges) {
      const open = toMinutes(r.open);
      const close = toMinutes(r.close);
      if (minutes >= open && minutes < close) {
        const left = close - minutes;
        if (left <= 30) {
          return { kind: 'closing-soon', closesAt: fmtTime(r.close), minutesLeft: left };
        }
        return { kind: 'open', closesAt: fmtTime(r.close), minutesLeft: left };
      }
    }
  }

  // find next opening
  for (let offset = 0; offset < 7; offset += 1) {
    const idx = (day + offset) % 7;
    const d = (hoursData.schedule as Day[])[idx];
    if (!d) continue;
    for (const r of d.ranges) {
      const open = toMinutes(r.open);
      if (offset === 0 && open <= minutes) continue;
      return {
        kind: 'closed',
        nextOpen: fmtTime(r.open),
        nextDayLabel: offset === 0 ? 'today' : offset === 1 ? 'tomorrow' : d.label,
      };
    }
  }
  return { kind: 'closed', nextOpen: '12pm', nextDayLabel: 'soon' };
}

export function weekTable(): Array<{ label: string; isToday: boolean; ranges: string[] }> {
  const { day } = nowInTZ();
  // re-order so today is first; rotates Sunday-first into a "today-first" view
  const list: Array<{ label: string; isToday: boolean; ranges: string[] }> = [];
  for (let i = 0; i < 7; i += 1) {
    const idx = (day + i) % 7;
    const d = (hoursData.schedule as Day[])[idx];
    if (!d) continue;
    list.push({
      label: d.label,
      isToday: i === 0,
      ranges: d.ranges.length === 0 ? ['Closed'] : d.ranges.map((r) => fmtRange(r.open, r.close)),
    });
  }
  return list;
}

export function openingHoursSpecification() {
  // Schema.org openingHoursSpecification, rendered in JSON-LD.
  const dayMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return (hoursData.schedule as Day[])
    .filter((d) => d.ranges.length > 0)
    .flatMap((d) =>
      d.ranges.map((r) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: dayMap[d.day],
        opens: r.open,
        closes: r.close,
      }))
    );
}
