import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export default async function NotFound() {
  const t = await getTranslations();

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="text-lg text-muted-foreground">{t("errors.notFound")}</p>
      <Button asChild>
        <Link href="/employees">{t("common.back")}</Link>
      </Button>
    </div>
  );
}
