/**
 * Цацралт-Одын портфолио өгөгдөл
 * Бүх мэдээлэл хавсаргасан index.html, minii-mergjil.html, youtube.html файлуудаас авсан.
 * Бүх холбоос https://graceful-meringue-2b7911.netlify.app/ угтвартай.
 */

export interface WorkProject {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  url: string;
  image: string;
  category: string;
  badge: string;
  highlights: string[];
}

export interface FactItem {
  id: string;
  label: string;
  value: string;
  subtext?: string;
  icon: string;
}

export interface YouTubeVideoItem {
  id: string;
  title: string;
  embedUrl: string;
  category: string;
}

export const PERSONAL_INFO = {
  name: "Цацралт-Од",
  latinName: "Tsatsralt-Od",
  age: "18 настай",
  tagline: "Мэргэжлийн хөл бөмбөгчин болох зорилготой залуу тамирчин ба бүтээгч",
  greeting: "Сайн байна уу, намайг Цацралт-Од гэдэг",
  bioParagraph1: "Сайн байна уу! Намайг Цацралт-Од гэдэг, би 18 настай. Миний амьдралын хамгийн том хобби болон тэмүүлэл бол хөл бөмбөг юм.",
  bioParagraph2: "Би багаасаа хөл бөмбөг тоглох дуртай бөгөөд өдөр бүр бэлтгэл сургуулилт хийж өөрийгөө тасралтгүй хөгжүүлдэг. Мөн аялалд явах, вэб технологи суралцах чин хүсэл эрмэлзэлтэй.",
  avatar: "https://i.guim.co.uk/img/media/d776c0e15e3789fa2c36005cb2fb5a02f660056a/4_50_4188_3350/master/4188.jpg?width=465&dpr=1&s=none&crop=none",
  soccerPitch: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800",
  playerProfile: "https://b.fssta.com/uploads/application/soccer/headshots/70204.png",
  netlifyBase: "https://graceful-meringue-2b7911.netlify.app/",
};

/**
 * "Миний бүтээлүүд": Нэг жагсаалт (array)
 * Дүрэм: Карт бүр шинэ цонхонд (target="_blank") нээгдэнэ.
 * Бүх URL https://graceful-meringue-2b7911.netlify.app/ угтвартай.
 */
export const MY_WORKS: WorkProject[] = [
  {
    id: "work-index",
    title: "Нүүр хуудас (Миний тухай)",
    subtitle: "Анхны хувийн портфолио хуудас",
    description: "Намайг танилцуулах үндсэн хуудас: нас, хобби, дуртай дуучин, сонирхолтой фактууд болон аяллын тухай мэдээлэл.",
    url: "https://graceful-meringue-2b7911.netlify.app/index.html",
    image: "https://i.guim.co.uk/img/media/d776c0e15e3789fa2c36005cb2fb5a02f660056a/4_50_4188_3350/master/4188.jpg?width=465&dpr=1&s=none&crop=none",
    category: "Вэб танилцуулга",
    badge: "Нүүр хуудас",
    highlights: ["18 настай", "Хөл бөмбөг хобби", "Дуртай дуучин Гангаа", "Дуртай кино Гоол"],
  },
  {
    id: "work-mergjil",
    title: "Миний мөрөөдлийн мэргэжил",
    subtitle: "Мэргэжлийн хөл бөмбөгчин болох зорилго",
    description: "Мэргэжлийн хөл бөмбөгчин болох хүсэл мөрөөдөл, энэ мэргэжлийг сонгосон 4 шалтгаан болон биелүүлэх 4 том зорилго.",
    url: "https://graceful-meringue-2b7911.netlify.app/minii-mergjil.html",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800",
    category: "Зорилго ба спорт",
    badge: "Мөрөөдлийн мэргэжил",
    highlights: ["Өдөр тутмын бэлтгэл", "Эрүүл мэнд ба хүч", "Талбайн ур чадвар", "Дэлхийгээр аялах"],
  },
  {
    id: "work-youtube",
    title: "YouTube хуудас ба видеонууд",
    subtitle: "Видео тоглуулагч бүхий вэб",
    description: "Хайлт, хажуугийн цэс (Нүүр, Shorts, Subscriptions), шүүлтүүр ангилал болон 5 онцлох видеог суулгасан бүрэн хуудас.",
    url: "https://graceful-meringue-2b7911.netlify.app/youtube.html",
    image: "https://b.fssta.com/uploads/application/soccer/headshots/70204.png",
    category: "Интерактив хуудас",
    badge: "YouTube клон",
    highlights: ["Видео тоглуулагч", "Ангиллын цэс", "Хайлт ба дүрсүүд", "Тамирчны зураг"],
  },
];

export const FACTS: FactItem[] = [
  { id: "f1", label: "Нас", value: "18 настай", subtext: "Залуу эрч хүч", icon: "Calendar" },
  { id: "f2", label: "Хобби", value: "Хөл бөмбөг тоглох", subtext: "Багаасаа хичээллэж буй", icon: "Activity" },
  { id: "f3", label: "Дуртай дуучин", value: "Гангаа", subtext: "Уран бүтээлүүд", icon: "Music" },
  { id: "f4", label: "Дуртай кино", value: "Гоол (Goal!)", subtext: "Хөл бөмбөгийн түүх", icon: "Film" },
  { id: "f5", label: "Дуртай тоглоом", value: "eFootball", subtext: "Спортын симуляци", icon: "Gamepad2" },
  { id: "f6", label: "Өдөр тутмын бэлтгэл", value: "Хөл бөмбөг", subtext: "Тасралтгүй бэлтгэл", icon: "Dumbbell" },
  { id: "f7", label: "Чөлөөт цаг", value: "Аялалд явах дуртай", subtext: "Шинэ газруудтай танилцах", icon: "Compass" },
];

export const DREAM_PROFESSION = {
  title: "Миний мөрөөдлийн мэргэжил",
  subtitle: "Мэргэжлийн хөл бөмбөгчин болох",
  description: "Миний мөрөөдөл бол ирээдүйд мэргэжлийн хөл бөмбөгчин болох юм. Би багаасаа хөл бөмбөг тоглох дуртай. Ирээдүйд сайн тамирчин болж, олон тэмцээнд оролцож, өөрийн чадвараа хөгжүүлэхийг хүсдэг.",
  reasons: [
    { icon: "⚽", text: "Би хөл бөмбөг тоглох дуртай." },
    { icon: "💪", text: "Би бэлтгэл хийж, өөрийгөө хөгжүүлэх дуртай." },
    { icon: "🏆", text: "Би олон тэмцээнд амжилт гаргахыг хүсдэг." },
    { icon: "🌍", text: "Би дэлхийн олон оронд аялж, тоглохыг мөрөөддөг." },
  ],
  goals: [
    { number: "01", text: "Өдөр бүр хөл бөмбөгийн бэлтгэл хийх." },
    { number: "02", text: "Эрүүл мэнд, биеийн хүчээ сайжруулах." },
    { number: "03", text: "Хөл бөмбөгийн ур чадвараа нэмэгдүүлэх." },
    { number: "04", text: "Ирээдүйд чадварлаг мэргэжлийн тамирчин болох." },
  ],
  motto: "Мөрөөдөлдөө хүрэхийн төлөө! ⚽",
};

export const YOUTUBE_VIDEOS: YouTubeVideoItem[] = [
  {
    id: "6wRrHtapCEE",
    title: "Онцлох видео 1",
    embedUrl: "https://www.youtube.com/embed/6wRrHtapCEE?si=rrKfF0dC4AA8Sr-E",
    category: "Хөгжим",
  },
  {
    id: "r7qovpFAGrQ",
    title: "Онцлох видео 2",
    embedUrl: "https://www.youtube.com/embed/r7qovpFAGrQ?si=n1U0HOyU0r57pdis",
    category: "Тоглоом",
  },
  {
    id: "V9rh9f1G5c8",
    title: "Онцлох видео 3",
    embedUrl: "https://www.youtube.com/embed/V9rh9f1G5c8?si=YvDI3PtguWPbqEzK",
    category: "Live",
  },
  {
    id: "ApXoWvfEYVU",
    title: "Онцлох видео 4",
    embedUrl: "https://www.youtube.com/embed/ApXoWvfEYVU?si=yPmL8QxhE-4kXv7R",
    category: "Аниме",
  },
  {
    id: "kTJczUoc26U",
    title: "Онцлох видео 5",
    embedUrl: "https://www.youtube.com/embed/kTJczUoc26U?si=usqDVC6Yxny8_dpZ",
    category: "Бүгд",
  },
];
