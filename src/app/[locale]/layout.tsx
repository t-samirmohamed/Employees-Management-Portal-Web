import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, Geist_Mono } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import "../globals.css";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@/shared/lib/theme-provider";
import { QueryProvider } from "@/shared/lib/query-provider";
import { ZodLocaleSync } from "@/shared/lib/zod-locale-sync";
import { Toaster } from "@/components/ui/sonner";

const ibmSansArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-geist-sans",
  subsets: ["arabic", "latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Employee Management",
  description: "Admin frontend for the Employee Management API",
};

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning className="platforms-code">
      <body className={`${ibmSansArabic.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <QueryProvider>
              <ZodLocaleSync />
              {children}
              <Toaster />
            </QueryProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
