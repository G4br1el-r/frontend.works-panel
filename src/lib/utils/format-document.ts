/** Formata CPF (11 dígitos) ou CNPJ (14). Devolve o valor original se não bater. */
export function formatDocument(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.length === 11) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  }

  if (digits.length === 14) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
  }

  return value;
}

/** Só os dígitos, para comparar busca digitada com documento do banco. */
export function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}
