"use client";

import { useState, useTransition } from "react";
import { useLocale } from "next-intl";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Locale, localeNames } from "@/lib/i18n";

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const [isPending, startTransition] = useTransition();

  function onSelectChange(newLocale: string) {
    startTransition(() => {
      document.cookie = `locale=${newLocale}; path=/; max-age=31536000`;
      window.location.reload();
    });
  }

  return (
    <Select
      defaultValue={locale}
      onValueChange={onSelectChange}
      disabled={isPending}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="vi">{localeNames.vi}</SelectItem>
          <SelectItem value="en">{localeNames.en}</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
