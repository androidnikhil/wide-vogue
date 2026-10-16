import { cookies } from "next/headers";
import { cache } from "react";
import { Language, translations, Translations } from "./translations";

/**
 * Server-side helper to read language from cookie (memoized per-request)
 */
export const getServerLanguage = cache(async (): Promise<Language> => {
  try {
    const cookieStore = await cookies();
    const lang = cookieStore.get("madhav_lang")?.value;
    return lang === "hi" ? "hi" : "en";
  } catch {
    return "en";
  }
});

/**
 * Server-side helper to get translations dictionary (memoized per-request)
 */
export const getServerTranslations = cache(async (): Promise<{ lang: Language; t: Translations }> => {
  const lang = await getServerLanguage();
  return { lang, t: translations[lang] };
});
