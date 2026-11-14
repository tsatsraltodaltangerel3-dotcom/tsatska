/**
 * Цацралт-Одын портфолио өгөгдөл
 * Бүх зураг нь дотоод найдвартай эх сурвалжаас (local assets) ачаалагдана.
 * Бүх гадаад холбоос https://graceful-meringue-2b7911.netlify.app/ болон төслийн үндсэн URL-тай.
 */

import javascriptAppsImg from '../assets/images/javascript_apps_showcase_1794637837200.jpg';
import heroFootballImg from '../assets/images/hero_football_action_1794638088487.jpg';
import workPortfolioImg from '../assets/images/work_portfolio_showcase_1794638088236.jpg';
import dreamStadiumImg from '../assets/images/dream_stadium_pitch_1794638088996.jpg';
import youtubeStudioImg from '../assets/images/youtube_media_studio_1794638089342.jpg';

export interface WorkProject {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  description: string;
  url: string;
  image: string;
  category: string;
  highlights: string[];
}

export interface FactItem {
  id: string;
  index: string;
  label: string;
  value: string;
  subtext: string;
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
  tagline: "Мэргэжлийн хөл бөмбөгчин болох зорилготой залуу тамирчин ба вэб бүтээгч",
  bioParagraph1:
    "Сайн байна уу! Намайг Цацралт-Од гэдэг, би 18 настай. Миний амьдралын хамгийн том хобби болон тэмүүлэл бол хөл бөмбөг юм.",
  bioParagraph2:
    "Би багаасаа хөл бөмбөг тоглох дуртай бөгөөд өдөр бүр бэлтгэл сургуулилт хийж өөрийгөө тасралтгүй хөгжүүлдэг. Мөн аялалд явах, вэб технологи суралцах чин хүсэл эрмэлзэлтэй.",
  heroImage: heroFootballImg,
  heroVideo: "https://video.wixstatic.com/video/827c6d_d388bdd325ab4451994e69b59f3a9185/1080p/mp4/file.mp4",
  heroVideoFallback: "/videos/football-hero.webm",
  stadiumPitch: dreamStadiumImg,
  studioImage: youtubeStudioImg,
  netlifyBase: "https://graceful-meringue-2b7911.netlify.app/",
};

export const KEY_METRICS = [
  { value: "18", label: "Нас · Залуу тамирчин" },
  { value: "04", label: "Вэб төсөл ба бүтээл" },
  { value: "04", label: "Том зорилго · Хөл бөмбөг" },
  { value: "08", label: "JavaScript мини апп" },
];

export const MY_WORKS: WorkProject[] = [
  {
    id: "work-index",
    index: "01",
    title: "Нүүр хуудас (Миний тухай)",
    subtitle: "Анхны хувийн портфолио хуудас",
    description:
      "Намайг танилцуулах үндсэн хуудас: нас, хобби, дуртай дуучин, сонирхолтой баримтууд болон аяллын тухай мэдээлэл.",
    url: "https://graceful-meringue-2b7911.netlify.app/index.html",
    image: workPortfolioImg,
    category: "Вэб танилцуулга",
    highlights: ["18 настай", "Хөл бөмбөг хобби", "Дуртай дуучин Гангаа", "Дуртай кино Гоол"],
  },
  {
    id: "work-mergjil",
    index: "02",
    title: "Миний мөрөөдлийн мэргэжил",
    subtitle: "Мэргэжлийн хөл бөмбөгчин болох зорилго",
    description:
      "Мэргэжлийн хөл бөмбөгчин болох хүсэл мөрөөдөл, энэ мэргэжлийг сонгосон 4 шалтгаан болон биелүүлэх 4 том зорилго.",
    url: "https://graceful-meringue-2b7911.netlify.app/minii-mergjil.html",
    image: dreamStadiumImg,
    category: "Зорилго ба спорт",
    highlights: ["Өдөр тутмын бэлтгэл", "Эрүүл мэнд ба хүч", "Талбайн ур чадвар", "Дэлхийгээр аялах"],
  },
  {
    id: "work-youtube",
    index: "03",
    title: "YouTube хуудас ба видеонууд",
    subtitle: "Видео тоглуулагч бүхий вэб",
    description:
      "Хайлт, хажуугийн цэс (Нүүр, Shorts, Subscriptions), шүүлтүүр ангилал болон 5 онцлох видеог суулгасан бүрэн хуудас.",
    url: "https://graceful-meringue-2b7911.netlify.app/youtube.html",
    image: youtubeStudioImg,
    category: "Интерактив хуудас",
    highlights: ["Видео тоглуулагч", "Ангиллын цэс", "Хайлт ба бүтэц", "Медиа цомог"],
  },
  {
    id: "work-javascript",
    index: "04",
    title: "Миний JavaScript апп-ууд",
    subtitle: "JavaScript бодлогуудыг UI-тай хялбар байдлаар",
    description:
      "Амьдарсан хугацаа, Тонгорогсон тоо, Дүн, Замын цагдаа, Үнэлгээ, Шатрын будаа, Чихэр хуваах болон Өнөөдөр юу үзэх вэ зэрэг 8 интерактив апп.",
    url: "https://splendid-shortbread-fbecb0.netlify.app/",
    image: javascriptAppsImg,
    category: "JavaScript & UI",
    highlights: ["8 мини апп", "Амьдарсан хугацаа", "Шатрын будаа", "Өнөөдөр юу үзэх вэ"],
  },
];

export const FACTS: FactItem[] = [
  { id: "f1", index: "01", label: "Нас", value: "18 настай", subtext: "Залуу эрч хүч ба тууштай байдал" },
  { id: "f2", index: "02", label: "Хобби", value: "Хөл бөмбөг", subtext: "Багаасаа тасралтгүй хичээллэж буй" },
  { id: "f3", index: "03", label: "Дуртай дуучин", value: "Гангаа", subtext: "Шинэ уран бүтээлүүд" },
  { id: "f4", index: "04", label: "Дуртай кино", value: "Гоол (Goal!)", subtext: "Хөл бөмбөгийн мөрөөдлийн түүх" },
  { id: "f5", index: "05", label: "Дуртай тоглоом", value: "eFootball", subtext: "Спортын тактик ба симуляци" },
  { id: "f6", index: "06", label: "Өдөр тутмын дадал", value: "Тогтмол бэлтгэл", subtext: "Тэсвэр хатуужил ба ур чадвар" },
  { id: "f7", index: "07", label: "Чөлөөт цаг", value: "Аялалд явах", subtext: "Шинэ соёл, шинэ газруудтай танилцах" },
];

export const DREAM_PROFESSION = {
  title: "Миний мөрөөдлийн мэргэжил",
  subtitle: "Мэргэжлийн хөл бөмбөгчин болох",
  description:
    "Миний мөрөөдөл бол ирээдүйд мэргэжлийн хөл бөмбөгчин болох юм. Би багаасаа хөл бөмбөг тоглох дуртай. Ирээдүйд сайн тамирчин болж, олон тэмцээнд оролцож, өөрийн чадвараа тасралтгүй хөгжүүлэхийг хүсдэг.",
  reasons: [
    { index: "01", title: "Чин хүсэл сонирхол", text: "Би хөл бөмбөг тоглох дуртай." },
    { index: "02", title: "Өдөр тутмын хөгжил", text: "Би бэлтгэл хийж, өөрийгөө хөгжүүлэх дуртай." },
    { index: "03", title: "Тэмцээний амжилт", text: "Би олон тэмцээнд амжилт гаргахыг хүсдэг." },
    { index: "04", title: "Дэлхийн тавцан", text: "Би дэлхийн олон оронд аялж, тоглохыг мөрөөддөг." },
  ],
  goals: [
    { number: "01", text: "Өдөр бүр хөл бөмбөгийн бэлтгэл хийх." },
    { number: "02", text: "Эрүүл мэнд, биеийн хүчээ сайжруулах." },
    { number: "03", text: "Хөл бөмбөгийн ур чадвараа нэмэгдүүлэх." },
    { number: "04", text: "Ирээдүйд чадварлаг мэргэжлийн тамирчин болох." },
  ],
  motto: "Мөрөөдөлдөө хүрэхийн төлөө!",
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
