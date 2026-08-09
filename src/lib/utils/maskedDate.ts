export function isoToMaskedDate(iso: string): string {
  const [year, month, day] = iso.split("-");
  if (!year || !month || !day) return "";
  return `${day}/${month}/${year}`;
}

export function maskedDateToIso(masked: string): string {
  const [day, month, year] = masked.split("/");
  if (!day || !month || !year || year.length < 4) return "";
  return `${year}-${month}-${day}`;
}
