import { ArrowDown, ArrowUp } from "lucide-react";
import { unmaskCurrency } from "@/lib/utils/format-currency";

interface PriceComparisonIconProps {
  unitPrice: string;
  basePrice: number;
}

export function PriceComparisonIcon({
  unitPrice,
  basePrice,
}: PriceComparisonIconProps) {
  const price = unmaskCurrency(unitPrice);

  if (price > basePrice)
    return <ArrowUp className="size-4 shrink-0 text-status-success" />;
  if (price < basePrice)
    return <ArrowDown className="size-4 shrink-0 text-status-danger" />;
  return null;
}
