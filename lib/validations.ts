import { z } from "zod";

export const TournamentItemSchema = z.object({
  id: z.string(),
  text: z.string().min(1, "Seçenek metni boş olamaz"),
  image: z.string().url("Geçerli bir görsel URL'i giriniz"),
});

export const QuizSchema = z.object({
  title: z.string().min(3, "Başlık en az 3 karakter olmalıdır").max(100, "Başlık çok uzun"),
  description: z.string().min(10, "Açıklama en az 10 karakter olmalıdır"),
  categorySlug: z.string().min(1, "Kategori seçiniz"),
  difficulty: z.enum(["Kolay", "Orta", "Zor"]),
  image: z.string().url("Kapak görseli URL'i geçersiz"),
  icon: z.string().optional(),
  gradient: z.string().optional(),
  items: z.array(TournamentItemSchema).min(16, "En az 16 seçenek eklemelisiniz"),
  isPopular: z.boolean().optional(),
  resultTitle: z.string().optional(),
  resultDescription: z.string().optional(),
});

export const CategorySchema = z.object({
  name: z.string().min(2, "Kategori adı en az 2 karakter olmalıdır"),
  slug: z.string().min(2, "Slug en az 2 karakter olmalıdır").regex(/^[a-z0-9-]+$/, "Slug sadece küçük harf, rakam ve tire içerebilir"),
  icon: z.string().optional(),
  description: z.string().min(5, "Açıklama en az 5 karakter olmalıdır"),
  gradient: z.string().optional(),
});
