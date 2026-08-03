import { SOLUTIONS_ITEMS } from "@/utils/constants";

export function getSolution(label: string) {
  return SOLUTIONS_ITEMS.find((solution) => solution.label === label);
}
