"use client";

import { InputComponent } from "@/components/shared/input-component";

interface SearchServiceItemsProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchServiceItems({
  value,
  onChange,
}: SearchServiceItemsProps) {
  return (
    <InputComponent.root className="items-start">
      <InputComponent.wrapper
        iconName="search"
        classNameWrapper="h-10 w-full rounded-lg border border-panel-border bg-panel-page/60 focus-within:border-panel-accent focus-within:ring-2 focus-within:ring-panel-accent/20 sm:w-1/2"
        classNameIcon="text-panel-muted-foreground"
      >
        <InputComponent.inputBase
          id="search-service-items"
          type="text"
          placeHolder="Buscar serviço..."
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="bg-transparent text-base text-panel-surface-foreground placeholder:text-panel-muted-foreground sm:text-sm"
        />
      </InputComponent.wrapper>
    </InputComponent.root>
  );
}
