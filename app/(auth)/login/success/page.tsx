"use client";

import BgImage from "@/assets/images/bg-image.png";
import LogoImage from "@/assets/images/logo-image.png";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import FilledImage from "@/components/ui/filled-image";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

const LoginSuccessPage = () => {
  const t = useTranslations();

  return (
    <div className="relative flex items-center justify-center min-h-screen w-screen overflow-hidden bg-gray-50">
      {/* Background */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <FilledImage src={BgImage} alt="Background" fit="cover" priority />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-white/60 via-transparent to-white/60 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-5 px-4 py-8 w-full max-w-sm">
        {/* Logo */}
        <Card className="w-full aspect-video shadow-md overflow-hidden">
          <FilledImage src={LogoImage} alt="Logo" fit="contain" priority />
        </Card>

        {/* Divider */}
        <div className="w-full flex items-center gap-3">
          <div className="flex-1 h-px bg-red-200" />
          <div className="w-2 h-2 rounded-full bg-red-700" />
          <div className="flex-1 h-px bg-red-200" />
        </div>

        {/* Success card */}
        <Card className="w-full px-6 py-8 text-center shadow-xl rounded-2xl border border-gray-100">
          {/* Animated check icon */}
          <div className="relative mx-auto mb-5 flex h-28 w-28 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-green-100 opacity-60" />
            <div className="absolute inset-3 rounded-full bg-green-200 opacity-70" />
            <div className="absolute inset-6 rounded-full bg-green-400 opacity-40" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-green-500 shadow-lg">
              <Check className="h-8 w-8 text-white" strokeWidth={3.5} />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-extrabold text-red-800 uppercase tracking-wide mb-1">
            {t("register.checkInSuccess")}
          </h1>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-1 my-3">
            <div className="w-8 h-0.5 bg-red-300 rounded-full" />
            <div className="w-3 h-0.5 bg-red-600 rounded-full" />
            <div className="w-8 h-0.5 bg-red-300 rounded-full" />
          </div>

          {/* Event title */}
          <p className="text-sm font-semibold text-red-700 uppercase mb-2">
            {t("register.title")}
          </p>

          {/* Description */}
          <p className="text-gray-500 text-sm mb-7">
            {t("register.successDescription")}
          </p>

          <Button
            asChild
            variant="outline"
            className="w-full border-red-800 text-red-800 hover:bg-red-50 hover:text-red-900 font-semibold"
          >
            <Link href="/register">{t("register.backToRegisterPage")}</Link>
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default LoginSuccessPage;
