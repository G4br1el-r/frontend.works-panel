/**
 * Baixa um PDF de orçamento. A resposta é binária, então precisa virar blob —
 * `response.json()` quebraria.
 */
async function downloadPdf(url: string, fileName: string) {
  const response = await fetch(url);

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message ?? "Falha ao gerar o PDF");
  }

  const blobUrl = URL.createObjectURL(await response.blob());
  const link = document.createElement("a");

  link.href = blobUrl;
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(blobUrl);
}

/** PDF do estado atual do orçamento — muda se o orçamento for editado. */
export function downloadBudgetPdf(budgetId: number) {
  return downloadPdf(
    `/api/works-panel/budget/${budgetId}/pdf`,
    `orcamento-${budgetId}.pdf`,
  );
}
