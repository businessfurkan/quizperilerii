"use server";

import { prisma } from "@/lib/prisma";
import { BoxNightTask } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getBoxNightTasks() {
  return await prisma.boxNightTask.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function createBoxNightTask(data: {
  text: string;
  type: string;
  icon: string;
  image?: string;
}) {
  const task = await prisma.boxNightTask.create({
    data: {
      text: data.text,
      type: data.type,
      icon: data.icon,
      image: data.image,
    },
  });

  revalidatePath("/admin/box-night");
  revalidatePath("/box-night");
  return task;
}

export async function updateBoxNightTask(
  id: string,
  data: {
    text: string;
    type: string;
    icon: string;
    image?: string;
  }
) {
  const task = await prisma.boxNightTask.update({
    where: { id },
    data: {
      text: data.text,
      type: data.type,
      icon: data.icon,
      image: data.image,
    },
  });

  revalidatePath("/admin/box-night");
  revalidatePath("/box-night");
  return task;
}

export async function deleteBoxNightTask(id: string) {
  await prisma.boxNightTask.delete({
    where: { id },
  });

  revalidatePath("/admin/box-night");
  revalidatePath("/box-night");
}
