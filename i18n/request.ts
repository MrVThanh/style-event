import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const rawLocale = cookieStore.get("locale")?.value || "vi";
  const baseLocale = rawLocale.split("-")[0];
  const locale = baseLocale === "en" || baseLocale === "vi" ? baseLocale : "vi";

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
