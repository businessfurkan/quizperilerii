"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Love Meter Actions
export async function getLoveMeterQuestions() {
  try {
    const questions = await prisma.loveMeterQuestion.findMany({
      orderBy: { order: "asc" },
    });
    return { success: true, data: questions };
  } catch (error) {
    return { success: false, error: "Failed to fetch questions" };
  }
}

export async function createLoveMeterQuestion(data: {
  text: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
}) {
  try {
    // Get highest order
    const lastQuestion = await prisma.loveMeterQuestion.findFirst({
      orderBy: { order: "desc" },
    });
    const order = lastQuestion ? lastQuestion.order + 1 : 0;

    await prisma.loveMeterQuestion.create({
      data: {
        ...data,
        order,
      },
    });
    revalidatePath("/gizli-yonetim-kapisi-2024/ask-metre");
    revalidatePath("/ask-metre");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to create question" };
  }
}

export async function updateLoveMeterQuestion(id: string, data: {
  text: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
}) {
  try {
    await prisma.loveMeterQuestion.update({
      where: { id },
      data,
    });
    revalidatePath("/gizli-yonetim-kapisi-2024/ask-metre");
    revalidatePath("/ask-metre");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update question" };
  }
}

export async function deleteLoveMeterQuestion(id: string) {
  try {
    await prisma.loveMeterQuestion.delete({
      where: { id },
    });
    revalidatePath("/gizli-yonetim-kapisi-2024/ask-metre");
    revalidatePath("/ask-metre");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete question" };
  }
}
