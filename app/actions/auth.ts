"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth-utils";

export async function registerUser(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, message: "Email ve şifre zorunludur." };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, message: "Bu email zaten kayıtlı." };
    }

    await prisma.user.create({
      data: {
        email,
        password: hashPassword(password),
      },
    });

    return { success: true, message: "Kayıt başarılı! Şimdi giriş yapabilirsiniz." };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, message: "Kayıt sırasında bir hata oluştu." };
  }
}
