"use server";

import { prisma } from "@/lib/prisma";
import { storageProvider } from "@/lib/storage";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { rateLimit } from "@/lib/rate-limit";

// --- Submission ---

export async function submitOutfit(formData: FormData) {
  // 1. Rate Limiting
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") || "unknown";
  
  const isAllowed = rateLimit({
    ip,
    limit: 3, // 3 submissions per window
    windowMs: 60 * 60 * 1000, // 1 hour
  });

  if (!isAllowed) {
    return { success: false, message: "Çok fazla deneme yaptınız. Lütfen daha sonra tekrar deneyin." };
  }

  const email = formData.get("email") as string;
  const fullName = formData.get("fullName") as string;
  const file = formData.get("file") as File;
  const ageConfirmed = formData.get("ageConfirmed") === "on";

  if (!email || !file || !ageConfirmed) {
    return { success: false, message: "Tüm alanları doldurun ve yaş onayını verin." };
  }

  // File size check (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return { success: false, message: "Dosya boyutu 5MB'dan küçük olmalıdır." };
  }

  // Check existing submission
  const existing = await prisma.outfitSubmission.findUnique({
    where: { email },
  });

  if (existing) {
    return { success: false, message: "Bu e-posta adresiyle zaten başvuru yapılmış." };
  }

  // Calculate Hash
  const buffer = Buffer.from(await file.arrayBuffer());
  const hash = crypto.createHash('sha256').update(buffer).digest('hex');

  // Check duplicate image
  const duplicate = await prisma.outfitSubmission.findFirst({
    where: { imageHash: hash },
  });

  if (duplicate) {
    return { success: false, message: "Bu fotoğraf daha önce yüklenmiş." };
  }

  try {
    const uploadResult = await storageProvider.uploadFile(file);

    await prisma.outfitSubmission.create({
      data: {
        email,
        fullName,
        imageUrl: uploadResult.url,
        imageHash: hash,
        status: "PENDING",
      },
    });

    return { success: true, message: "Başvurunuz alındı! Onaylandıktan sonra yarışmaya dahil edilecektir." };
  } catch (error) {
    console.error("Submission error:", error);
    return { success: false, message: "Yükleme sırasında bir hata oluştu." };
  }
}

// --- Admin ---

export async function getAdminSubmissions() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    throw new Error("Unauthorized");
  }

  return await prisma.outfitSubmission.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function updateSubmissionStatus(id: string, status: string) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    throw new Error("Unauthorized");
  }

  if (status === "DELETED") {
     const submission = await prisma.outfitSubmission.findUnique({ where: { id } });
     if (submission) {
        // Delete file if possible (storage provider might need delete method)
        // For now just delete record
        await prisma.outfitSubmission.delete({ where: { id } });
        await prisma.auditLog.create({
            data: { 
              action: "DELETE_SUBMISSION",
              description: `Admin deleted submission: ${submission.email}`,
              userId: (session.user as any).id 
            }
        });
     }
  } else {
    await prisma.outfitSubmission.update({
        where: { id },
        data: { status },
    });
  }

  revalidatePath("/gizli-yonetim-kapisi-2024/kombin");
  return { success: true };
}

export async function getRandomApprovedSubmissions(count: number = 10) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    throw new Error("Unauthorized");
  }

  const approved = await prisma.outfitSubmission.findMany({
    where: { status: "APPROVED" },
    select: { id: true },
  });

  if (approved.length < count) {
    return { success: false, message: `Yeterli onaylı başvuru yok. (Mevcut: ${approved.length}, Gerekli: ${count})` };
  }

  const shuffled = approved.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count).map((s: any) => s.id);

  return { success: true, ids: selected };
}

export async function createCompetition(submissionIds: string[]) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    throw new Error("Unauthorized");
  }

  if (submissionIds.length !== 10) {
    return { success: false, message: "Yarışma için tam 10 kombin seçmelisiniz." };
  }

  try {
    // End active competitions
    await prisma.outfitCompetition.updateMany({
      where: { status: "ACTIVE" },
      data: { status: "COMPLETED", endDate: new Date() },
    });

    await prisma.outfitCompetition.create({
      data: {
        status: "ACTIVE",
        currentRound: "ROUND_1",
        startDate: new Date(),
        endDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        entries: {
          create: submissionIds.map(id => ({
            submissionId: id,
            round: "ROUND_1",
          }))
        }
      },
    });

    // Update submission status
    await prisma.outfitSubmission.updateMany({
      where: { id: { in: submissionIds } },
      data: { status: "SELECTED" },
    });

    // Delete unselected submissions (Privacy requirement: "İlk 10’a giremeyenlerin foto ve emailleri otomatik silinir.")
    // We delete all PENDING, APPROVED, REJECTED submissions that were not selected.
    const unselected = await prisma.outfitSubmission.findMany({
      where: {
        id: { notIn: submissionIds },
        status: { in: ["PENDING", "APPROVED", "REJECTED"] }
      }
    });

    for (const sub of unselected) {
       await prisma.auditLog.create({
         data: { 
           action: "SYSTEM_DELETE_UNSELECTED",
           description: `Not selected for competition: ${sub.email}`,
           userId: "SYSTEM"
         }
       });
    }

    await prisma.outfitSubmission.deleteMany({
      where: {
        id: { notIn: submissionIds },
        status: { in: ["PENDING", "APPROVED", "REJECTED"] }
      }
    });

    revalidatePath("/gizli-yonetim-kapisi-2024/kombin");
    revalidatePath("/kombin-yarismasi");
    return { success: true, message: "Yarışma başlatıldı! Seçilmeyen başvurular silindi." };
  } catch (error) {
    console.error("Create competition error:", error);
    return { success: false, message: "Yarışma başlatılamadı." };
  }
}

// --- Voting & Competition Logic ---

export async function getActiveCompetition() {
  const competition = await prisma.outfitCompetition.findFirst({
    where: { status: "ACTIVE" },
    include: {
      entries: {
        where: {
            // Filter entries by current round
            // We need to fetch competition first to know the round, but Prisma doesn't support using parent field in relation filter directly in one go easily without complex where.
            // So we'll fetch all entries and filter in JS, or fetch properly.
        },
        include: { submission: true },
        orderBy: { votes: "desc" }
      }
    },
  });

  if (!competition) return null;

  // Filter entries for current round
  competition.entries = competition.entries.filter((e: any) => e.round === competition.currentRound);

  return competition;
}

export async function castVote(entryId: string) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { success: false, message: "Oy vermek için giriş yapmalısınız." };
  }

  const userId = (session.user as any).id;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existingVote = await prisma.outfitVote.findFirst({
    where: {
      userId,
      createdAt: {
        gte: today,
      },
    },
  });

  if (existingVote) {
    return { success: false, message: "Bugün zaten oy kullandınız. Yarın tekrar bekleriz!" };
  }

  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for") || "unknown";

  try {
    await prisma.$transaction([
      prisma.outfitVote.create({
        data: {
          entryId,
          userId,
          userIp: ip as string,
        },
      }),
      prisma.outfitCompetitionEntry.update({
        where: { id: entryId },
        data: { votes: { increment: 1 } },
      }),
    ]);

    revalidatePath("/kombin-yarismasi");
    return { success: true, message: "Oyunuz kaydedildi!" };
  } catch (error) {
    return { success: false, message: "Oy verme işlemi başarısız." };
  }
}

export async function advanceCompetition() {
  const competition = await prisma.outfitCompetition.findFirst({
    where: { status: "ACTIVE" },
    include: {
      entries: {
        include: { submission: true },
      }
    },
  });

  if (!competition || !competition.endDate) return { success: false, message: "No active competition" };

  if (new Date() < new Date(competition.endDate)) {
    return { success: false, message: "Round not finished yet" };
  }

  const currentEntries = competition.entries.filter((e: any) => e.round === competition.currentRound);
  const sortedEntries = currentEntries.sort((a: any, b: any) => b.votes - a.votes);

  let nextRound = "";
  let winnersCount = 0;

  if (competition.currentRound === "ROUND_1") {
    nextRound = "SEMI_FINAL";
    winnersCount = 5;
  } else if (competition.currentRound === "SEMI_FINAL") {
    nextRound = "FINAL";
    winnersCount = 2;
  } else if (competition.currentRound === "FINAL") {
    nextRound = "COMPLETED";
    winnersCount = 1; // Winner
  }

  // Identify winners and losers
  const winners = sortedEntries.slice(0, winnersCount);
  const losers = sortedEntries.slice(winnersCount);

  // Transaction for atomic update
  try {
    await prisma.$transaction(async (tx: any) => {
      // 1. Delete losers data (Submission and Entry)
      for (const loser of losers) {
        // Log deletion
        await tx.auditLog.create({
          data: { 
            action: "SYSTEM_ELIMINATION",
            description: `Eliminated in ${competition.currentRound}: ${loser.submission.email}`,
            userId: "SYSTEM"
          }
        });
        
        // Delete submission (Cascade should handle entries/votes if configured, but let's be safe)
        // Actually schema doesn't specify cascade on Submission relation in Entry?
        // Let's check schema: Entry -> Submission relation.
        // If we delete Submission, we should delete Entry.
        
        // We delete the Submission record.
        await tx.outfitSubmission.delete({
            where: { id: loser.submissionId }
        });
      }

      if (nextRound === "COMPLETED") {
        // Competition Finished
        await tx.outfitCompetition.update({
          where: { id: competition.id },
          data: { 
            status: "COMPLETED",
            currentRound: "COMPLETED"
          },
        });
        
        // Mark winner?
        // Maybe we don't need to do anything specific, just keep the data.
        
      } else {
        // Next Round
        // Create new entries for winners
        for (const winner of winners) {
          await tx.outfitCompetitionEntry.create({
            data: {
              competitionId: competition.id,
              submissionId: winner.submissionId,
              round: nextRound,
              votes: 0, // Reset votes
            }
          });
        }

        // Update Competition
        await tx.outfitCompetition.update({
          where: { id: competition.id },
          data: {
            currentRound: nextRound,
            endDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Another 24 hours
          }
        });
      }
    });

    revalidatePath("/kombin-yarismasi");
    return { success: true, message: `Competition advanced to ${nextRound}` };
  } catch (error) {
    console.error("Advance competition error:", error);
    return { success: false, message: "Error advancing competition" };
  }
}
