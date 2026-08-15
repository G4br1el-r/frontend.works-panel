export function formatDate(value: string) {
  const date = new Date(value);
  const dateLabel = date.toLocaleDateString("pt-BR");
  const timeLabel = date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${dateLabel} às ${timeLabel}`;
}
