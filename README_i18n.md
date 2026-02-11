# i18n Setup - Next.js with next-intl

## Đã cài đặt

✅ **next-intl** - Thư viện quốc tế hóa cho Next.js  
✅ **Hỗ trợ 2 ngôn ngữ**: Tiếng Việt (vi) và English (en)  
✅ **Cookie-based locale switching** - Ngôn ngữ được lưu trong cookie

## Cấu trúc thư mục

```
style-event/
├── i18n/
│   ├── messages/
│   │   ├── vi.json          # Bản dịch tiếng Việt
│   │   └── en.json          # Bản dịch tiếng Anh
│   └── request.ts           # Cấu hình i18n
├── lib/
│   └── i18n.ts              # Định nghĩa locale types
├── components/
│   └── language-switcher.tsx # Component chuyển đổi ngôn ngữ
└── app/
    └── layout.tsx           # Root layout với NextIntlClientProvider
```

## Cách sử dụng

### 1. Trong Server Components

```tsx
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations();

  return (
    <div>
      <h1>{t("register.title")}</h1>
    </div>
  );
}
```

### 2. Trong Client Components

```tsx
"use client";
import { useTranslations } from "next-intl";

export default function ClientComponent() {
  const t = useTranslations();

  return (
    <div>
      <h1>{t("register.title")}</h1>
    </div>
  );
}
```

### 3. Thêm bản dịch mới

Thêm key mới vào cả 2 file:

- `i18n/messages/vi.json`
- `i18n/messages/en.json`

Ví dụ:

```json
{
  "register": {
    "newKey": "Giá trị tiếng Việt"
  }
}
```

### 4. Sử dụng Language Switcher

Component `LanguageSwitcher` đã được tích hợp sẵn trong register page:

```tsx
import { LanguageSwitcher } from "@/components/language-switcher";

<LanguageSwitcher />;
```

## Validation với i18n

Form validation cũng đã được tích hợp với i18n:

```ts
// validation/auth/register-account.ts
export const createRegisterAccountSchema = (t: any) =>
  z.object({
    full_name: z.string().min(1, t("register.validation.fullNameRequired")),
    email: z.string().email(t("register.validation.emailInvalid")),
    // ...
  });
```

## Locale mặc định

- **Default locale**: Tiếng Việt (vi)
- Locale được lưu trong cookie với tên `locale`
- Cookie có thời hạn 1 năm (max-age=31536000)

## Chạy ứng dụng

```bash
npm run dev
```

Truy cập: http://localhost:3000/register

## Cấu hình thêm ngôn ngữ

Để thêm ngôn ngữ mới (ví dụ: Tiếng Trung):

1. Tạo file `i18n/messages/zh.json`
2. Thêm locale vào `lib/i18n.ts`:

```ts
export type Locale = "vi" | "en" | "zh";
export const locales: Locale[] = ["vi", "en", "zh"];
export const localeNames: Record<Locale, string> = {
  vi: "🇻🇳 Tiếng Việt",
  en: "🇺🇸 English",
  zh: "🇨🇳 中文",
};
```

3. Thêm option trong `LanguageSwitcher` component
