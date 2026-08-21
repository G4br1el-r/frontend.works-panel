import type {
  EmployeerScheduleResponseType,
  EmployeerScheduleWorkType,
} from "@/@type/works-panel/employeer/get-employeer-schedule.type";

/**
 * `date` é coluna DATE e chega como "YYYY-MM-DDT00:00:00.000Z". Formatar no
 * fuso local jogaria o dia 06 para 05 no Brasil (UTC-3), então lemos em UTC.
 */
export function formatScheduleDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

/** "06/10 – 07/10/2026", compacto quando o ano é o mesmo. */
export function formatWorkPeriod(startDate: string, endDate: string): string {
  const start = formatScheduleDate(startDate);
  const end = formatScheduleDate(endDate);

  if (start === end) return start;

  const sameYear = start.slice(-4) === end.slice(-4);
  return `${sameYear ? start.slice(0, 5) : start} – ${end}`;
}

export function isWorkCanceled(work: EmployeerScheduleWorkType): boolean {
  return work.budgetStatus === "CANCELED";
}

/**
 * Dias de obra confirmada. O backend inclui as canceladas em `totals`, mas a
 * coluna da tabela mostra compromisso real — obra cancelada não ocupa a agenda.
 */
export function countConfirmedDays(
  schedule: EmployeerScheduleResponseType,
): number {
  return schedule.works
    .filter((work) => !isWorkCanceled(work))
    .reduce((sum, work) => sum + work.daysCount, 0);
}

export interface EmployeerScheduleSummary {
  confirmedDays: number;
  canceledDays: number;
  worksCount: number;
}

export function toScheduleSummary(
  schedule: EmployeerScheduleResponseType,
): EmployeerScheduleSummary {
  const canceled = schedule.works.filter(isWorkCanceled);

  return {
    confirmedDays: countConfirmedDays(schedule),
    canceledDays: canceled.reduce((sum, work) => sum + work.daysCount, 0),
    worksCount: schedule.works.filter((work) => !isWorkCanceled(work)).length,
  };
}
