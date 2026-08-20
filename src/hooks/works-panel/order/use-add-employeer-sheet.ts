"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import type { EmployeerResponseType } from "@/@type/works-panel/employeer/get-employeer.type";
import type { SelectComboboxOption } from "@/components/shared/select-combobox";
import { formatCurrency, generateId, maskCurrency } from "@/lib/utils";
import type { AttendanceOccurrence } from "@/lib/utils/get-attendance-occurrences";
import type {
  EmployeerFormRow,
  WeekDay,
} from "@/store/works-panel/order/new-order-store";

interface DraftState {
  employeerId: string | null;
  employeer: EmployeerResponseType | null;
  selectedDates: string[];
  dailyRate: string;
}

const EMPTY_DRAFT: DraftState = {
  employeerId: null,
  employeer: null,
  selectedDates: [],
  dailyRate: "",
};

const WEEK_DAY_LABELS: Record<WeekDay, string> = {
  SUN: "Dom",
  MON: "Seg",
  TUE: "Ter",
  WED: "Qua",
  THU: "Qui",
  FRI: "Sex",
  SAT: "Sáb",
};

export interface DateShortcut {
  key: string;
  label: string;
  count: number;
  dateKeys: string[];
}

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function useAddEmployeerSheet(
  employeers: EmployeerResponseType[],
  occurrences: AttendanceOccurrence[],
  existingRows: EmployeerFormRow[],
) {
  const [draft, setDraft] = useState<DraftState>(EMPTY_DRAFT);
  const [pendingItems, setPendingItems] = useState<EmployeerFormRow[]>([]);

  const usedEmployeerIds = new Set([
    ...existingRows.map((row) => row.employeer.id),
    ...pendingItems.map((item) => item.employeer.id),
  ]);

  const employeerOptions: SelectComboboxOption[] = employeers
    .filter((employeer) => !usedEmployeerIds.has(employeer.id))
    .map((employeer) => ({
      value: String(employeer.id),
      label: employeer.name,
      hint: formatCurrency(employeer.dailyRate),
    }));

  const occurrenceKeys = occurrences.map((occurrence) =>
    toDateKey(occurrence.date),
  );
  const allDatesSelected =
    occurrenceKeys.length > 0 &&
    draft.selectedDates.length === occurrenceKeys.length;

  // Atalhos derivados das ocorrências reais: só aparece o que existe no período.
  const weekDayShortcuts: DateShortcut[] = (
    Object.keys(WEEK_DAY_LABELS) as WeekDay[]
  )
    .map((weekDay) => {
      const dateKeys = occurrences
        .filter((occurrence) => occurrence.weekDay === weekDay)
        .map((occurrence) => toDateKey(occurrence.date));

      return {
        key: `weekday-${weekDay}`,
        label: WEEK_DAY_LABELS[weekDay],
        count: dateKeys.length,
        dateKeys,
      };
    })
    .filter((shortcut) => shortcut.count > 0);

  const monthShortcuts: DateShortcut[] = Array.from(
    occurrences
      .reduce((acc, occurrence) => {
        const monthKey = format(occurrence.date, "yyyy-MM");
        const existing = acc.get(monthKey);

        if (existing) {
          existing.dateKeys.push(toDateKey(occurrence.date));
          existing.count += 1;
          return acc;
        }

        acc.set(monthKey, {
          key: `month-${monthKey}`,
          label: format(occurrence.date, "MMM/yy", { locale: ptBR }),
          count: 1,
          dateKeys: [toDateKey(occurrence.date)],
        });
        return acc;
      }, new Map<string, DateShortcut>())
      .values(),
  );

  function reset() {
    setDraft(EMPTY_DRAFT);
    setPendingItems([]);
  }

  function handleEmployeerChange(employeerId: string | null) {
    const employeer =
      employeers.find((entry) => String(entry.id) === employeerId) ?? null;
    setDraft((current) => ({
      ...current,
      employeerId,
      employeer,
      dailyRate: employeer ? maskCurrency(employeer.dailyRate) : "",
    }));
  }

  function toggleDate(dateKey: string) {
    setDraft((current) => ({
      ...current,
      selectedDates: current.selectedDates.includes(dateKey)
        ? current.selectedDates.filter((key) => key !== dateKey)
        : [...current.selectedDates, dateKey],
    }));
  }

  function toggleAllDates() {
    setDraft((current) => ({
      ...current,
      selectedDates: allDatesSelected ? [] : occurrenceKeys,
    }));
  }

  /**
   * Soma ou remove o atalho da seleção, sem apagar o resto. Permite montar
   * combinações como segunda + terça + quinta.
   */
  function selectShortcut(dateKeys: string[]) {
    setDraft((current) => {
      const isFullySelected = dateKeys.every((dateKey) =>
        current.selectedDates.includes(dateKey),
      );

      if (isFullySelected) {
        return {
          ...current,
          selectedDates: current.selectedDates.filter(
            (dateKey) => !dateKeys.includes(dateKey),
          ),
        };
      }

      return {
        ...current,
        selectedDates: [...new Set([...current.selectedDates, ...dateKeys])],
      };
    });
  }

  /** Ativo quando todas as datas do atalho estão marcadas. */
  function isShortcutActive(dateKeys: string[]) {
    return (
      dateKeys.length > 0 &&
      dateKeys.every((dateKey) => draft.selectedDates.includes(dateKey))
    );
  }

  function handleDailyRateChange(dailyRate: string) {
    setDraft((current) => ({ ...current, dailyRate }));
  }

  const canAddDraft =
    Boolean(draft.employeer) &&
    draft.selectedDates.length > 0 &&
    Boolean(draft.dailyRate);

  function handleAddDraftToPending() {
    if (!draft.employeer || !canAddDraft) return;

    setPendingItems((current) => [
      ...current,
      {
        id: generateId(),
        employeer: draft.employeer!,
        selectedDates: draft.selectedDates,
        dailyRate: draft.dailyRate,
      },
    ]);
    setDraft(EMPTY_DRAFT);
  }

  function handleRemovePendingItem(id: string) {
    setPendingItems((current) => current.filter((item) => item.id !== id));
  }

  return {
    draft,
    pendingItems,
    employeerOptions,
    occurrenceKeys,
    allDatesSelected,
    weekDayShortcuts,
    monthShortcuts,
    canAddDraft,
    reset,
    handleEmployeerChange,
    toggleDate,
    toggleAllDates,
    selectShortcut,
    isShortcutActive,
    handleDailyRateChange,
    handleAddDraftToPending,
    handleRemovePendingItem,
  };
}
