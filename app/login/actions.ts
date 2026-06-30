"use server";

import { signIn } from "@/auth";

export async function loginAction(
  password: string,
  callbackUrl: string
): Promise<{ error: string } | void> {
  try {
    await signIn("credentials", { password, redirectTo: callbackUrl });
  } catch (error) {
    const digest = (error as { digest?: string })?.digest;
    if (digest?.startsWith("NEXT_REDIRECT")) throw error;
    return { error: "비밀번호가 올바르지 않습니다." };
  }
}
