export function formatCurrency(value: number | string) {
  const price = typeof value === "string" ? Number(value) : value;
  return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function maskCurrency(value: number) {
  if (!value) return "";
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function unmaskCurrency(masked: string) {
  if (!masked) return 0;
  return Number(masked.replace(/\./g, "").replace(",", "."));
}
