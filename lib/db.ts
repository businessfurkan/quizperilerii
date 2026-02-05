import { prisma } from "@/lib/prisma";
import { Quiz, Category, TournamentItem, Prisma, Poll, PollOption, BoxNightTask } from "@prisma/client";

// Re-export types from Prisma Client to ensure consistency
// Note: If you see linter errors here after schema update, try restarting the TS server
export type { Quiz, Category, TournamentItem, Poll, PollOption, BoxNightTask };

// Deprecated: DBData type is no longer used with Prisma
export type DBData = {
  quizzes: Quiz[];
  categories: Category[];
  popularQuizIds: string[];
};

// Helper to simulate the old getDB structure for backward compatibility where possible
// But mostly we should move away from it.
// We'll return a Promise that resolves to a structure similar to DBData if absolutely necessary,
// but it's better to refactor the callers.

export async function getQuizzes() {
  return await prisma.quiz.findMany({
    include: {
      items: {
        orderBy: {
          order: 'asc'
        } as any
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

export async function getCategories() {
  return await prisma.category.findMany();
}

export async function getQuizById(id: string) {
  return await prisma.quiz.findUnique({
    where: { id },
    include: {
      items: {
        orderBy: {
          order: 'asc'
        } as any
      }
    }
  });
}

export async function saveQuiz(quizData: Partial<Quiz> & { items?: { text: string; image: string }[] }) {
  const { items, ...data } = quizData;
  
  // If we have items, we need to handle the relation
  // Strategy: Delete existing items and create new ones (simplest for full update)
  
  if (!data.id) {
    throw new Error("Quiz ID is required");
  }

  // Check if quiz exists
  const existing = await prisma.quiz.findUnique({ where: { id: data.id } });

  if (existing) {
    // Update
    return await prisma.$transaction(async (tx: any) => {
      // Update quiz fields
      const updated = await tx.quiz.update({
        where: { id: data.id },
        data: {
            title: data.title,
            description: data.description,
            categorySlug: data.categorySlug,
            difficulty: data.difficulty,
            image: data.image,
            icon: data.icon,
            gradient: data.gradient,
            resultTitle: data.resultTitle,
            resultDescription: data.resultDescription,
            isPopular: data.isPopular,
            updatedAt: new Date()
        }
      });

      if (items) {
        // Delete old items
        await tx.tournamentItem.deleteMany({
          where: { quizId: data.id }
        });

        // Create new items
        // items might be missing quizId, so we map them
        await tx.tournamentItem.createMany({
          data: items.map((item: { text: string; image: string }, index: number) => ({
            text: item.text,
            image: item.image,
            quizId: data.id!,
            order: index
          }))
        });
      }
      
      return updated;
    });
  } else {
    // Create
    return await prisma.quiz.create({
      data: {
        id: data.id,
        title: data.title!,
        description: data.description!,
        categorySlug: data.categorySlug!,
        difficulty: data.difficulty!,
        image: data.image!,
        icon: data.icon!,
        gradient: data.gradient!,
        resultTitle: data.resultTitle,
        resultDescription: data.resultDescription,
        isPopular: data.isPopular || false,
        items: {
          create: items?.map((item: { text: string; image: string }, index: number) => ({
            text: item.text,
            image: item.image,
            order: index
          })) || []
        }
      }
    });
  }
}

export async function deleteQuiz(id: string) {
  return await prisma.quiz.delete({
    where: { id }
  });
}

export async function togglePopular(id: string) {
  const quiz = await prisma.quiz.findUnique({ where: { id } });
  if (quiz) {
    return await prisma.quiz.update({
      where: { id },
      data: { isPopular: !quiz.isPopular }
    });
  }
  return null;
}

export async function setPopular(id: string, isPopular: boolean) {
  return await prisma.quiz.update({
    where: { id },
    data: { isPopular }
  });
}

export async function isPopular(id: string): Promise<boolean> {
  const quiz = await prisma.quiz.findUnique({ 
    where: { id },
    select: { isPopular: true }
  });
  return quiz?.isPopular ?? false;
}

export async function getCategoryById(id: string) {
  return await prisma.category.findUnique({
    where: { id }
  });
}

export async function saveCategory(category: Category) {
  return await prisma.category.upsert({
    where: { id: category.id },
    update: category,
    create: category
  });
}

export async function deleteCategory(id: string) {
  return await prisma.category.delete({
    where: { id }
  });
}

// New helper for popular quizzes to replace getDB usage in home page
export async function getPopularQuizzes() {
  return await prisma.quiz.findMany({
    where: { isPopular: true },
    include: {
      items: {
        orderBy: {
          order: 'asc'
        } as any
      }
    },
    orderBy: {
        createdAt: 'desc'
    }
  });
}

// POLLS
export async function getPolls() {
  return await prisma.poll.findMany({
    orderBy: { createdAt: 'desc' },
    include: { options: true }
  });
}

export async function getPollById(id: string) {
  return await prisma.poll.findUnique({
    where: { id },
    include: { options: true }
  });
}

export async function savePoll(pollData: Partial<Poll> & { options?: { text: string; image?: string }[] }) {
  const { options, ...data } = pollData;

  if (data.id) {
    const existing = await prisma.poll.findUnique({ where: { id: data.id } });
    if (existing) {
        return await prisma.$transaction(async (tx) => {
            const updated = await tx.poll.update({
                where: { id: data.id },
                data: {
                    question: data.question,
                    description: data.description,
                    slug: data.slug,
                    isActive: data.isActive,
                    startDate: data.startDate,
                    endDate: data.endDate,
                    updatedAt: new Date()
                }
            });

            if (options) {
                 await tx.pollOption.deleteMany({ where: { pollId: data.id } });
                 await tx.pollOption.createMany({
                    data: options.map(opt => ({
                        text: opt.text,
                        image: opt.image,
                        pollId: data.id!
                    }))
                 });
            }
            return updated;
        });
    }
  }

  // Create
  return await prisma.poll.create({
    data: {
        question: data.question!,
        description: data.description,
        slug: data.slug!,
        isActive: data.isActive ?? true,
        startDate: data.startDate || new Date(),
        endDate: data.endDate,
        options: {
            create: options?.map(opt => ({
                text: opt.text,
                image: opt.image
            })) || []
        }
    }
  });
}

export async function deletePoll(id: string) {
    return await prisma.poll.delete({ where: { id } });
}

export async function getActivePoll() {
  const now = new Date();
  return await prisma.poll.findFirst({
    where: {
      isActive: true,
      startDate: { lte: now },
      OR: [
        { endDate: null },
        { endDate: { gte: now } }
      ]
    },
    include: { options: true },
    orderBy: { startDate: 'desc' }
  });
}

export async function votePoll(optionId: string, demographics?: { ageRange: string; gender: string; city: string }) {
    return await prisma.$transaction(async (tx) => {
        // Increment votes
        await tx.pollOption.update({
            where: { id: optionId },
            data: { votes: { increment: 1 } }
        });

        // Get pollId
        const option = await tx.pollOption.findUnique({
            where: { id: optionId },
            select: { pollId: true }
        });

        if (option && demographics) {
            // Create Vote record
            await tx.vote.create({
                data: {
                    pollId: option.pollId,
                    optionId: optionId,
                    ageRange: demographics.ageRange,
                    gender: demographics.gender,
                    city: demographics.city
                }
            });
        }
        
        return { pollId: option?.pollId };
    });
}

export async function getDemographicTopOption(pollId: string, demographics: { ageRange: string; gender: string }) {
    const topOption = await prisma.vote.groupBy({
        by: ['optionId'],
        where: {
            pollId,
            ageRange: demographics.ageRange,
            gender: demographics.gender
        },
        _count: {
            optionId: true
        },
        orderBy: {
            _count: {
                optionId: 'desc'
            }
        },
        take: 1
    });

    if (topOption.length > 0) {
        const option = await prisma.pollOption.findUnique({
            where: { id: topOption[0].optionId }
        });
        return option?.text;
    }
    return null;
}
