"use client";

import { DatePicker } from "@/components/shared/date-picker";
import { useBudgetFieldErrors } from "@/hooks/works-panel/order/use-budget-field-errors";
import { useNewOrderStore } from "@/store/works-panel/order/new-order-store";
import { WrapperForm } from "../wrapper-form";

export function ScheduleForm() {
  const startDate = useNewOrderStore((state) => state.startDate);
  const endDate = useNewOrderStore((state) => state.endDate);
  const setStartDate = useNewOrderStore((state) => state.setStartDate);
  const setEndDate = useNewOrderStore((state) => state.setEndDate);
  const fieldErrors = useBudgetFieldErrors();

  return (
    <WrapperForm
      title="Prazo"
      description="Defina o período de execução da obra."
      icon="calendar"
    >
      <div className="flex w-full flex-col gap-1.5">
        <span className="text-sm font-medium text-panel-surface-foreground">
          Início da obra
        </span>
        <DatePicker
          id="start-date"
          value={startDate}
          onChange={setStartDate}
          placeholder="dd/mm/aaaa"
          hasError={Boolean(fieldErrors.startDate)}
        />
      </div>

      <div className="flex w-full flex-col gap-1.5">
        <span className="text-sm font-medium text-panel-surface-foreground">
          Fim da obra
        </span>
        <DatePicker
          id="end-date"
          value={endDate}
          onChange={setEndDate}
          placeholder="dd/mm/aaaa"
          hasError={Boolean(fieldErrors.endDate)}
        />
      </div>
    </WrapperForm>
  );
}
