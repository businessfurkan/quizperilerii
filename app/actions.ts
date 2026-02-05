"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { saveQuiz, deleteQuiz, togglePopular, setPopular, getQuizById, saveCategory, deleteCategory, getCategoryById, savePoll, deletePoll, votePoll, getDemographicTopOption } from "@/lib/db";
import { Quiz, Category } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { QuizSchema, CategorySchema } from "@/lib/validations";
import { z } from "zod";

// Helper for auth check
async function checkAuth() {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Unauthorized access");
  }
}

// QUIZ ACTIONS
export async function createQuiz(formData: FormData) {
  await checkAuth();

  const rawData = {
    title: formData.get("title"),
    description: formData.get("description"),
    categorySlug: formData.get("categorySlug"),
    difficulty: formData.get("difficulty"),
    image: formData.get("image"),
    icon: formData.get("icon"),
    gradient: formData.get("gradient"),
    isPopular: formData.get("isPopular") === "on",
    resultTitle: formData.get("resultTitle"),
    resultDescription: formData.get("resultDescription"),
    items: JSON.parse(formData.get("items") as string || "[]"),
  };

  const validatedData = QuizSchema.parse(rawData);

  const newQuiz = {
    id: Date.now().toString(),
    ...validatedData,
    icon: validatedData.icon || "help-circle",
    gradient: validatedData.gradient || "from-blue-500 to-cyan-500",
  };

  await saveQuiz(newQuiz);
  if (validatedData.isPopular) {
    await setPopular(newQuiz.id, true);
  }
  revalidatePath("/");
  revalidatePath("/admin/quizzes");
  redirect("/admin/quizzes");
}

export async function updateQuiz(id: string, formData: FormData) {
  await checkAuth();

  const rawData = {
    title: formData.get("title"),
    description: formData.get("description"),
    categorySlug: formData.get("categorySlug"),
    difficulty: formData.get("difficulty"),
    image: formData.get("image"),
    icon: formData.get("icon"),
    gradient: formData.get("gradient"),
    isPopular: formData.get("isPopular") === "on",
    resultTitle: formData.get("resultTitle"),
    resultDescription: formData.get("resultDescription"),
    items: JSON.parse(formData.get("items") as string || "[]"),
  };

  const validatedData = QuizSchema.parse(rawData);

  const updatedQuiz = {
    id,
    ...validatedData,
    icon: validatedData.icon || "help-circle", 
    gradient: validatedData.gradient || "from-blue-500 to-cyan-500",
  };

  await saveQuiz(updatedQuiz);
  await setPopular(id, !!validatedData.isPopular);
  revalidatePath("/");
  revalidatePath("/admin/quizzes");
  redirect("/admin/quizzes");
}

export async function deleteQuizAction(id: string) {
  await checkAuth();
  await deleteQuiz(id);
  revalidatePath("/");
  revalidatePath("/admin/quizzes");
}

export async function togglePopularAction(id: string) {
  await checkAuth();
  await togglePopular(id);
  revalidatePath("/");
  revalidatePath("/admin/quizzes");
}

export async function createCategory(formData: FormData) {
  await checkAuth();
  
  const rawData = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    icon: formData.get("icon"),
    description: formData.get("description"),
    gradient: formData.get("gradient"),
  };

  const validatedData = CategorySchema.parse(rawData);

  const newCategory: Category = {
    id: Date.now().toString(),
    ...validatedData,
    icon: validatedData.icon || "tag",
    gradient: validatedData.gradient || "from-blue-500 to-cyan-500",
  };

  await saveCategory(newCategory);
  revalidatePath("/");
  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function updateCategory(id: string, formData: FormData) {
  await checkAuth();
  
  const rawData = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    icon: formData.get("icon"),
    description: formData.get("description"),
    gradient: formData.get("gradient"),
  };

  const validatedData = CategorySchema.parse(rawData);

  const updatedCategory = {
    id,
    ...validatedData,
    icon: validatedData.icon || "tag",
    gradient: validatedData.gradient || "from-blue-500 to-cyan-500",
  };

  await saveCategory(updatedCategory);
  revalidatePath("/");
  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function deleteCategoryAction(id: string) {
  await checkAuth();
  await deleteCategory(id);
  revalidatePath("/");
  revalidatePath("/admin/categories");
}


// POLL ACTIONS

export async function submitPollVote(optionId: string, demographics?: { ageRange: string; gender: string; city: string }) {
  const result = await votePoll(optionId, demographics);
  
  let topOption = null;
  if (result?.pollId && demographics) {
      topOption = await getDemographicTopOption(result.pollId, demographics);
  }
  
  revalidatePath("/poll");
  return topOption;
}

const PollSchema = z.object({
  question: z.string().min(1, "Soru gereklidir"),
  description: z.string().optional(),
  slug: z.string().min(1, "Slug gereklidir"),
  isActive: z.boolean().default(true),
  startDate: z.string().optional().transform(str => str ? new Date(str) : new Date()),
  endDate: z.string().optional().transform(str => str ? new Date(str) : undefined),
  options: z.array(z.object({
    text: z.string().min(1, "Seçenek metni gereklidir"),
    image: z.string().optional()
  })).min(2, "En az 2 seçenek gereklidir")
});

export async function createPoll(formData: FormData) {
  await checkAuth();
  
  const rawData = {
    question: formData.get("question"),
    description: formData.get("description"),
    slug: formData.get("slug"),
    isActive: formData.get("isActive") === "on",
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    options: JSON.parse(formData.get("options") as string || "[]"),
  };

  const validated = PollSchema.parse(rawData);

  await savePoll(validated);
  revalidatePath("/");
  revalidatePath("/admin/polls");
  redirect("/admin/polls");
}

export async function updatePoll(id: string, formData: FormData) {
    await checkAuth();
    
    const rawData = {
      question: formData.get("question"),
      description: formData.get("description"),
      slug: formData.get("slug"),
      isActive: formData.get("isActive") === "on",
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
      options: JSON.parse(formData.get("options") as string || "[]"),
    };
  
    const validated = PollSchema.parse(rawData);
  
    await savePoll({ id, ...validated });
    revalidatePath("/");
    revalidatePath("/admin/polls");
    redirect("/admin/polls");
}

export async function deletePollAction(id: string) {
    await checkAuth();
    await deletePoll(id);
    revalidatePath("/");
    revalidatePath("/admin/polls");
}
