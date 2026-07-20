import { notFound } from "next/navigation";

// Catches any URL under a valid locale that doesn't match a real page. Without
// this, an unmatched path skips the [locale] tree entirely and Next.js falls
// back to the untranslated root not-found.tsx instead of this segment's
// translated one. Calling notFound() from *within* the matched [locale] tree
// is what makes the nested, translated not-found.tsx apply.
export default function CatchAll() {
  notFound();
}
