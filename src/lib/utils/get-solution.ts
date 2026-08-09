import { SOLUTIONS_ITEMS } from "@/lib/utils/constants";

export function getSolution(label: string) {
  return SOLUTIONS_ITEMS.find((solution) => solution.label === label);
}
