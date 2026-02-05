
export type Poll = {
  id: string;
  question: string;
  image?: string;
  options: { id: string; text: string; votes: number }[];
  endDate: string; // ISO Date string
};

export const dailyPoll: Poll = {
  id: "poll-1",
  question: "Sizce 2026 yılının en iyi teknolojik gelişmesi ne olacak?",
  image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=2070&auto=format&fit=crop",
  options: [
    { id: "opt-1", text: "Yapay Zeka Asistanları (Her evde robot)", votes: 120 },
    { id: "opt-2", text: "Uçan Arabalar (Sonunda!)", votes: 45 },
    { id: "opt-3", text: "Uzay Turizmi", votes: 85 },
    { id: "opt-4", text: "Kuantum Bilgisayarlar", votes: 60 },
  ],
  endDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
};

export const cities = [
  "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir",
  "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli",
  "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari",
  "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir",
  "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir",
  "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat",
  "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman",
  "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"
];
