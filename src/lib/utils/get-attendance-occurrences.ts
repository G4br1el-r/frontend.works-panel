import type {
  AttendanceDays,
  WeekDay,
} from "@/store/works-panel/order/new-order-store";

const WEEK_DAY_BY_INDEX: WeekDay[] = [
  "SUN",
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT",
];

function parseBrDate(value: string): Date | null {
  const [day, month, year] = value.split("/").map(Number);
  if (!day || !month || !year) return null;
  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? null : date;
}

export interface AttendanceOccurrence {
  date: Date;
  weekDay: WeekDay;
}

/**
 * Conta quantas vezes cada dia da semana ocorre dentro do período da obra,
 * ignorando quais dias estão selecionados. Serve para saber quais dias podem
 * ser oferecidos: numa obra de 18/08 a 18/08 só existe uma terça-feira.
 */
export function countWeekDaysInPeriod(
  startDate: string,
  endDate: string,
): Record<WeekDay, number> {
  const counts = WEEK_DAY_BY_INDEX.reduce(
    (acc, weekDay) => {
      acc[weekDay] = 0;
      return acc;
    },
    {} as Record<WeekDay, number>,
  );

  const start = parseBrDate(startDate);
  const end = parseBrDate(endDate);
  if (!start || !end || start > end) return counts;

  const cursor = new Date(start);

  while (cursor <= end) {
    counts[WEEK_DAY_BY_INDEX[cursor.getDay()]] += 1;
    cursor.setDate(cursor.getDate() + 1);
  }

  return counts;
}

export function getAttendanceOccurrences(
  startDate: string,
  endDate: string,
  attendanceDays: AttendanceDays,
): AttendanceOccurrence[] {
  const start = parseBrDate(startDate);
  const end = parseBrDate(endDate);
  if (!start || !end || start > end) return [];

  const selectedWeekDays = new Set(
    (Object.keys(attendanceDays) as WeekDay[]).filter(
      (day) => attendanceDays[day].selected,
    ),
  );
  if (selectedWeekDays.size === 0) return [];

  const occurrences: AttendanceOccurrence[] = [];
  const cursor = new Date(start);

  while (cursor <= end) {
    const weekDay = WEEK_DAY_BY_INDEX[cursor.getDay()];
    if (selectedWeekDays.has(weekDay)) {
      occurrences.push({ date: new Date(cursor), weekDay });
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return occurrences;
}
