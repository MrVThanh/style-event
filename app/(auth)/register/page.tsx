"use client";

import { register } from "@/actions/auth/register";
import BgImage from "@/assets/images/bg-image.png";
import LogoImage from "@/assets/images/logo-image.png";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import FilledImage from "@/components/ui/filled-image";
import { Input } from "@/components/ui/input";
import {
  createRegisterAccountSchema,
  TRegisterAccountSchema,
} from "@/validation/auth/register-account";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { isApiError } from "@/lib/http";

const RegisterPage = () => {
  const t = useTranslations();
  const [isPending, startTransition] = useTransition();

  const form = useForm<TRegisterAccountSchema>({
    resolver: zodResolver(createRegisterAccountSchema(t)),
    defaultValues: {
      full_name: "",
      email: "",
      company_name: "",
      position: "",
      phone: "",
    },
  });

  function onSubmit(data: TRegisterAccountSchema) {
    startTransition(async () => {
      const response = await register(data);
      if (isApiError(response)) {
        toast.error(response.message);
      } else {
        toast.success(t("register.success"));
      }
    });
  }

  return (
    <div className="flex items-center justify-center h-screen w-screen overflow-hidden">
      <div className="size-full grid grid-cols-1 md:grid-cols-4">
        <div className="md:col-span-3">
          <FilledImage src={BgImage} alt="Background Image" fit="fill" />
        </div>

        <div className="flex flex-col gap-4 justify-start col-span-1 md:col-span-1 rounded-none p-4 overflow-y-auto">
          <Card className="w-full aspect-video">
            <FilledImage src={LogoImage} alt="Logo" fit="contain" />
          </Card>

          <div className="flex justify-end">
            <LanguageSwitcher />
          </div>

          <h1 className="text-xl font-bold text-center text-red-800">
            {t("register.title")}
          </h1>

          <form id="register-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              {/* Full Name */}
              <Controller
                name="full_name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-1">
                    <FieldLabel htmlFor="full_name">
                      {t("register.fullName")}{" "}
                      <span className="text-red-600">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      disabled={isPending}
                      id="full_name"
                      aria-invalid={fieldState.invalid}
                      placeholder={t("register.fullNamePlaceholder")}
                      autoComplete="name"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Email */}
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-1">
                    <FieldLabel htmlFor="email">
                      {t("register.email")}{" "}
                      <span className="text-red-600">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      disabled={isPending}
                      id="email"
                      type="email"
                      aria-invalid={fieldState.invalid}
                      placeholder={t("register.emailPlaceholder")}
                      autoComplete="email"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Company Name */}
              <Controller
                name="company_name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-1">
                    <FieldLabel htmlFor="company_name">
                      {t("register.companyName")}{" "}
                      <span className="text-red-600">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      disabled={isPending}
                      id="company_name"
                      aria-invalid={fieldState.invalid}
                      placeholder={t("register.companyNamePlaceholder")}
                      autoComplete="organization"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Position */}
              <Controller
                name="position"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-1">
                    <FieldLabel htmlFor="position">
                      {t("register.position")}{" "}
                      <span className="text-red-600">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      disabled={isPending}
                      id="position"
                      aria-invalid={fieldState.invalid}
                      placeholder={t("register.positionPlaceholder")}
                      autoComplete="organization-title"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Phone */}
              <Controller
                name="phone"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-1">
                    <FieldLabel htmlFor="phone">
                      {t("register.phone")}{" "}
                      <span className="text-red-600">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      id="phone"
                      type="tel"
                      disabled={isPending}
                      aria-invalid={fieldState.invalid}
                      placeholder={t("register.phonePlaceholder")}
                      autoComplete="tel"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                className="flex-1"
                disabled={isPending}
              >
                {t("register.reset")}
              </Button>
              <Button
                type="submit"
                form="register-form"
                className="flex-1 bg-red-800 hover:bg-red-900"
                disabled={isPending}
              >
                {isPending && <Loader2 className="animate-spin" />}
                {isPending ? t("register.submitting") : t("register.submit")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
