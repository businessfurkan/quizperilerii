import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  const dbPath = path.join(process.cwd(), "data", "db.json");
  const data = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

  const { quizzes, categories, popularQuizIds } = data;

  console.log("Seeding categories...");
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        icon: category.icon,
        gradient: category.gradient,
      },
      create: {
        id: category.id,
        slug: category.slug,
        name: category.name,
        description: category.description,
        icon: category.icon,
        gradient: category.gradient,
      },
    });
  }

  console.log("Seeding quizzes...");
  for (const quiz of quizzes) {
    const isPopular = popularQuizIds.includes(quiz.id);
    
    // Check if category exists (it should, as we just seeded them)
    // The JSON data has categorySlug in quiz matching category slug.
    
    await prisma.quiz.upsert({
      where: { id: quiz.id },
      update: {
        title: quiz.title,
        description: quiz.description,
        difficulty: quiz.difficulty,
        image: quiz.image,
        icon: quiz.icon,
        gradient: quiz.gradient,
        resultTitle: quiz.resultTitle,
        resultDescription: quiz.resultDescription,
        isPopular: isPopular,
        categorySlug: quiz.categorySlug,
      },
      create: {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        difficulty: quiz.difficulty,
        image: quiz.image,
        icon: quiz.icon,
        gradient: quiz.gradient,
        resultTitle: quiz.resultTitle,
        resultDescription: quiz.resultDescription,
        isPopular: isPopular,
        categorySlug: quiz.categorySlug,
        items: {
            create: quiz.items.map((item: any, index: number) => ({
                text: item.text,
                image: item.image,
                order: index
            }))
        }
      },
    });

    // If we are updating, we might want to replace items too, but for now upsert on quiz is enough for basic migration.
    // If items changed, logic would be more complex (deleteMany then createMany), 
    // but since this is a one-time migration/seed from JSON, upsert is fine. 
    // However, if the quiz exists, we are not updating items here. 
    // To ensure items are correct, let's delete and recreate items if updating.
    
    const existingQuiz = await prisma.quiz.findUnique({ where: { id: quiz.id }, include: { items: true } });
    if (existingQuiz) {
        // If we just created it via upsert.create, items are there. 
        // If it existed (update), we didn't touch items in update block above.
        // Let's force update items.
        await prisma.tournamentItem.deleteMany({ where: { quizId: quiz.id } });
        await prisma.tournamentItem.createMany({
            data: quiz.items.map((item: any, index: number) => ({
                text: item.text,
                image: item.image,
                order: index,
                quizId: quiz.id
            }))
        });
    }
  }

  console.log("Seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
