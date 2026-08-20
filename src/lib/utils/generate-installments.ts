export const PAYMENT_TYPES = [
  "single",
  "weekly",
  "biweekly",
  "monthly",
] as const;
export type PaymentType = (typeof PAYMENT_TYPES)[number];

function parseBrDate(value: string): Date | null {
  const [day, month, year] = value.split("/").map(Number);
  if (!day || !month || !year) return null;
  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? null : date;
}

function addInterval(date: Date, paymentType: PaymentType, step: number): Date {
  const next = new Date(date);
  if (paymentType === "weekly") next.setDate(next.getDate() + 7 * step);
  else if (paymentType === "biweekly") next.setDate(next.getDate() + 14 * step);
  else if (paymentType === "monthly") next.setMonth(next.getMonth() + step);
  return next;
}

export function getInstallmentCount(
  startDate: string,
  endDate: string,
  firstInstallmentDate: string,
  paymentType: PaymentType,
): number {
  if (paymentType === "single") return 1;

  const start = parseBrDate(firstInstallmentDate) ?? parseBrDate(startDate);
  const end = parseBrDate(endDate);
  if (!start || !end || start > end) return 0;

  let count = 1;
  let cursor = start;
  while (true) {
    const next = addInterval(cursor, paymentType, 1);
    if (next > end) break;
    cursor = next;
    count += 1;
  }

  return count;
}

export function generateInstallmentDueDates(
  firstInstallmentDate: string,
  paymentType: PaymentType,
  count: number,
): Date[] {
  const first = parseBrDate(firstInstallmentDate);
  if (!first || count <= 0) return [];

  return Array.from({ length: count }, (_, index) =>
    addInterval(first, paymentType, index),
  );
}

/**
 * Quantas parcelas cabem no total, dado o valor de cada uma. O pagamento não se
 * limita ao período da obra: obra de 1 semana com parcela semanal de R$3.000 e
 * total de R$10.000 vira 4 cobranças (3 cheias + R$1.000).
 */
export function getInstallmentCountByAmount(
  totalAmount: number,
  installmentAmount: number,
): number {
  if (installmentAmount <= 0 || totalAmount <= 0) return 0;

  const totalCents = Math.round(totalAmount * 100);
  const amountCents = Math.round(installmentAmount * 100);

  return Math.ceil(totalCents / amountCents);
}

/**
 * Divide fixando o valor de cada parcela; a última recebe o que sobrar.
 * Ex: R$10.000 em parcelas de R$3.000 → 3.000, 3.000, 3.000, 1.000.
 */
export function splitAmountByInstallment(
  totalAmount: number,
  installmentAmount: number,
): number[] {
  const count = getInstallmentCountByAmount(totalAmount, installmentAmount);
  if (count === 0) return [];

  const totalCents = Math.round(totalAmount * 100);
  const amountCents = Math.round(installmentAmount * 100);

  return Array.from({ length: count }, (_, index) => {
    const isLast = index === count - 1;
    const remainingCents = totalCents - amountCents * index;

    return (isLast ? remainingCents : amountCents) / 100;
  });
}

export function splitAmountEqually(
  totalAmount: number,
  count: number,
): number[] {
  if (count <= 0) return [];

  const cents = Math.round(totalAmount * 100);
  const baseCents = Math.floor(cents / count);
  const remainderCents = cents - baseCents * count;

  return Array.from({ length: count }, (_, index) => {
    const amountCents =
      index === count - 1 ? baseCents + remainderCents : baseCents;
    return amountCents / 100;
  });
}
