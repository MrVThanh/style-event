"use server";

import {
  handleServerError,
  http,
  isApiError,
  type ApiResponse,
} from "@/lib/http";
import { TRegisterAccountSchema } from "@/validation/auth/register-account";

export async function register(
  body: TRegisterAccountSchema,
): Promise<ApiResponse> {
  try {
    const res = await http.post(`/api/v1/registers`, body, {
      baseUrl: "https://13-213-64-179.nip.io",
      insecureTls: true,
    });

    if (isApiError(res)) return res;
    const { message, status_code } = res;

    return {
      message,
      status_code,
    };
  } catch (error) {
    return handleServerError(error);
  }
}
