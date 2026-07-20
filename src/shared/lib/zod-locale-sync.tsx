"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { z } from "zod";
import { en, ar } from "zod/locales";

export function ZodLocaleSync() {
  const locale = useLocale();

  useEffect(() => {
    z.config((locale === "ar" ? ar : en)());
  }, [locale]);

  return null;
}
