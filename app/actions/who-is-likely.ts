"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getWhoIsLikelyQuestions() {
  try {
    const questions = await prisma.whoIsLikelyQuestion.findMany({
      orderBy: { order: "asc" },
    });
    return { success: true, data: questions };
  } catch (error) {
    return { success: false, error: "Failed to fetch questions" };
  }
}

export async function createWhoIsLikelyQuestion(data: {
  text: string;
}) {
  try {
    // Get highest order
    const lastQuestion = await prisma.whoIsLikelyQuestion.findFirst({
      orderBy: { order: "desc" },
    });
    const order = lastQuestion ? lastQuestion.order + 1 : 0;

    await prisma.whoIsLikelyQuestion.create({
      data: {
        ...data,
        order,
      },
    });
    revalidatePath("/gizli-yonetim-kapisi-2024/kim-daha");
    revalidatePath("/kim-daha");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to create question" };
  }
}

export async function updateWhoIsLikelyQuestion(id: string, data: {
  text: string;
}) {
  try {
    await prisma.whoIsLikelyQuestion.update({
      where: { id },
      data,
    });
    revalidatePath("/gizli-yonetim-kapisi-2024/kim-daha");
    revalidatePath("/kim-daha");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update question" };
  }
}

export async function deleteWhoIsLikelyQuestion(id: string) {
  try {
    await prisma.whoIsLikelyQuestion.delete({
      where: { id },
    });
    revalidatePath("/gizli-yonetim-kapisi-2024/kim-daha");
    revalidatePath("/kim-daha");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete question" };
  }
}
