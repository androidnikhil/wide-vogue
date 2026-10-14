import { cookies } from "next/headers";
import { Language, translations, Translations } from "./translations";

/**
 * Server-side helper to read language from cookie
 */
export async function getServerLanguage(): Promise<Language> {
  try {
    const cookieStore = await cookies();
    const lang = cookieStore.get("madhav_lang")?.value;
    return lang === "hi" ? "hi" : "en";
  } catch {
    return "en";
  }
}

/**
 * Server-side helper to get translations dictionary
 */
export async function getServerTranslations(): Promise<{ lang: Language; t: Translations }> {
  const lang = await getServerLanguage();
  return { lang, t: translations[lang] };
}
