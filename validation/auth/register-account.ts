import * as z from "zod";

export const createRegisterAccountSchema = (t: any) =>
  z.object({
    full_name: z.string().min(1, t("register.validation.fullNameRequired")),
    email: z
      .string()
      .min(1, t("register.validation.emailRequired"))
      .email(t("register.validation.emailInvalid")),
    company_name: z
      .string()
      .min(1, t("register.validation.companyNameRequired")),
    position: z.string().min(1, t("register.validation.positionRequired")),
    phone: z
      .string()
      .min(1, t("register.validation.phoneRequired"))
      .regex(/^[0-9]{10,11}$/, t("register.validation.phoneInvalid")),
  });

export const registerAccountSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  company_name: z.string().min(1, "Company name is required"),
  position: z.string().min(1, "Position is required"),
  phone: z
    .string()
    .min(1, "Phone is required")
    .regex(/^[0-9]{10,11}$/, "Invalid phone number"),
});

export type TRegisterAccountSchema = z.infer<typeof registerAccountSchema>;
