"use client";

import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const LOCALE_LABELS: Record<string, string> = { en: "English", ar: "العربية" };

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleSelect(nextLocale: string) {
    const qs = searchParams.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { locale: nextLocale });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm">
          <Languages />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {routing.locales.map((loc) => (
          <DropdownMenuItem key={loc} onSelect={() => handleSelect(loc)} disabled={loc === locale}>
            {LOCALE_LABELS[loc] ?? loc}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
