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

export interface ServiceItem {
  id: string;
  index: string;
  category: string;
  name: string;
  description: string;
  phone: string;
  highlights: string[];
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
  heroVideo: "/assets/aistudio/SaveInta.com_AQMAw9jblVJiymNHnLdguVFMmQFU-sQgzplKYC6kEBDL3gvOuXhpBiJbkcW5Jb9zRh4sPhb7t1dt89RlU1HpDmjz_f4a453dc.mp4",
  heroVideoFallback: "/assets/aistudio/SaveInta.com_AQMAw9jblVJiymNHnLdguVFMmQFU-sQgzplKYC6kEBDL3gvOuXhpBiJbkcW5Jb9zRh4sPhb7t1dt89RlU1HpDmjz_f4a453dc.mp4",
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

export const SERVICES: ServiceItem[] = [
  {
    id: "service-fc-mobile",
    index: "01",
    category: "Тоглоом хөгжүүлэлт",
    name: "FC Mobile тоглоом хөгжүүлэх",
    description:
      "FC Mobile багийн OVR өсгөх, тактик ба байрлалын оновчтой тохиргоо хийх, Division Rivals зэрэглэл ахиулах болон тоглоомын ур чадварын зөвлөгөө.",
    phone: "+976 9508-5672",
    highlights: ["Багийн OVR хөгжүүлэлт", "Тактик тохиргоо", "Тоглолтын зөвлөгөө"],
  },
  {
    id: "service-football-info",
    index: "02",
    category: "Спортын мэдээлэл",
    name: "Хөл бөмбөгийн талаар мэдээлэл өгөх",
    description:
      "Олон улсын болон дотоодын хөл бөмбөгийн лигийн мэдээлэл, тоглолтын задлан шинжилгээ, бэлтгэлийн үндсэн техник ба анхан шатны чиглүүлэг.",
    phone: "+976 9508-5672",
    highlights: ["Тоглолтын шинжилгээ", "Бэлтгэлийн чиглүүлэг", "Лигийн мэдээлэл"],
  },
];

export interface FootballInfoItem {
  id: string;
  index: string;
  category: string;
  subtitle: string;
  title: string;
  description: string;
  fullDetails: string[];
  image: string;
  highlights: string[];
  sourceLabel: string;
  url?: string;
  hasTop5Archive?: boolean;
}

export interface Top5LeagueSeason {
  season: string;
  premierLeague: string;
  laLiga: string;
  serieA: string;
  bundesliga: string;
  ligue1: string;
}

export const TOP5_LEAGUES_2000_2026: Top5LeagueSeason[] = [
  { season: "2025–26", premierLeague: "Arsenal", laLiga: "Barcelona", serieA: "Inter Milan", bundesliga: "Bayern Munich", ligue1: "Paris Saint-Germain" },
  { season: "2024–25", premierLeague: "Liverpool", laLiga: "Barcelona", serieA: "Napoli", bundesliga: "Bayern Munich", ligue1: "Paris Saint-Germain" },
  { season: "2023–24", premierLeague: "Manchester City", laLiga: "Real Madrid", serieA: "Inter Milan", bundesliga: "Bayer Leverkusen", ligue1: "Paris Saint-Germain" },
  { season: "2022–23", premierLeague: "Manchester City", laLiga: "Barcelona", serieA: "Napoli", bundesliga: "Bayern Munich", ligue1: "Paris Saint-Germain" },
  { season: "2021–22", premierLeague: "Manchester City", laLiga: "Real Madrid", serieA: "AC Milan", bundesliga: "Bayern Munich", ligue1: "Paris Saint-Germain" },
  { season: "2020–21", premierLeague: "Manchester City", laLiga: "Atlético Madrid", serieA: "Inter Milan", bundesliga: "Bayern Munich", ligue1: "Lille" },
  { season: "2019–20", premierLeague: "Liverpool", laLiga: "Real Madrid", serieA: "Juventus", bundesliga: "Bayern Munich", ligue1: "Paris Saint-Germain" },
  { season: "2018–19", premierLeague: "Manchester City", laLiga: "Barcelona", serieA: "Juventus", bundesliga: "Bayern Munich", ligue1: "Paris Saint-Germain" },
  { season: "2017–18", premierLeague: "Manchester City", laLiga: "Barcelona", serieA: "Juventus", bundesliga: "Bayern Munich", ligue1: "Paris Saint-Germain" },
  { season: "2016–17", premierLeague: "Chelsea", laLiga: "Real Madrid", serieA: "Juventus", bundesliga: "Bayern Munich", ligue1: "AS Monaco" },
  { season: "2015–16", premierLeague: "Leicester City", laLiga: "Barcelona", serieA: "Juventus", bundesliga: "Bayern Munich", ligue1: "Paris Saint-Germain" },
  { season: "2014–15", premierLeague: "Chelsea", laLiga: "Barcelona", serieA: "Juventus", bundesliga: "Bayern Munich", ligue1: "Paris Saint-Germain" },
  { season: "2013–14", premierLeague: "Manchester City", laLiga: "Atlético Madrid", serieA: "Juventus", bundesliga: "Bayern Munich", ligue1: "Paris Saint-Germain" },
  { season: "2012–13", premierLeague: "Manchester United", laLiga: "Barcelona", serieA: "Juventus", bundesliga: "Bayern Munich", ligue1: "Paris Saint-Germain" },
  { season: "2011–12", premierLeague: "Manchester City", laLiga: "Real Madrid", serieA: "Juventus", bundesliga: "Borussia Dortmund", ligue1: "Montpellier" },
  { season: "2010–11", premierLeague: "Manchester United", laLiga: "Barcelona", serieA: "AC Milan", bundesliga: "Borussia Dortmund", ligue1: "Lille" },
  { season: "2009–10", premierLeague: "Chelsea", laLiga: "Barcelona", serieA: "Inter Milan", bundesliga: "Bayern Munich", ligue1: "Marseille" },
  { season: "2008–09", premierLeague: "Manchester United", laLiga: "Barcelona", serieA: "Inter Milan", bundesliga: "VfL Wolfsburg", ligue1: "Bordeaux" },
  { season: "2007–08", premierLeague: "Manchester United", laLiga: "Real Madrid", serieA: "Inter Milan", bundesliga: "Bayern Munich", ligue1: "Lyon" },
  { season: "2006–07", premierLeague: "Manchester United", laLiga: "Real Madrid", serieA: "Inter Milan", bundesliga: "VfB Stuttgart", ligue1: "Lyon" },
  { season: "2005–06", premierLeague: "Chelsea", laLiga: "Barcelona", serieA: "Inter Milan*", bundesliga: "Bayern Munich", ligue1: "Lyon" },
  { season: "2004–05", premierLeague: "Chelsea", laLiga: "Barcelona", serieA: "Олгогдоогүй*", bundesliga: "Bayern Munich", ligue1: "Lyon" },
  { season: "2003–04", premierLeague: "Arsenal", laLiga: "Valencia", serieA: "AC Milan", bundesliga: "Werder Bremen", ligue1: "Lyon" },
  { season: "2002–03", premierLeague: "Manchester United", laLiga: "Real Madrid", serieA: "Juventus", bundesliga: "Bayern Munich", ligue1: "Lyon" },
  { season: "2001–02", premierLeague: "Arsenal", laLiga: "Valencia", serieA: "Juventus", bundesliga: "Borussia Dortmund", ligue1: "Lyon" },
  { season: "2000–01", premierLeague: "Manchester United", laLiga: "Real Madrid", serieA: "AS Roma", bundesliga: "Bayern Munich", ligue1: "Nantes" },
  { season: "1999–00", premierLeague: "Manchester United", laLiga: "Deportivo La Coruña", serieA: "Lazio", bundesliga: "Bayern Munich", ligue1: "AS Monaco" },
];

export const FOOTBALL_INFO_ITEMS: FootballInfoItem[] = [
  {
    id: "fb-info-ucl",
    index: "01",
    category: "Лигийн тойм",
    subtitle: "2000–2026 оны бүрэн архив",
    title: "Аваргуудын Лиг ба Топ 5 Лиг",
    description:
      "2000 оноос 2026 он хүртэлх Европын Топ 5 лигийн (Premier League, La Liga, Serie A, Bundesliga, Ligue 1) бүх улирлын аваргууд болон онцлох мэдээлэл.",
    fullDetails: [
      "Английн Premier League, Испанийн La Liga, Италийн Serie A, Германы Bundesliga болон Францын Ligue 1 нь дэлхийн хамгийн өндөр түвшний Топ 5 хөл бөмбөгийн лиг юм.",
      "2000–2026 оны хооронд Bayern Munich (20 түрүү), Barcelona (13 түрүү), PSG (12 түрүү), Juventus (11 түрүү), Manchester City болон Manchester United (тус бүр 8 түрүү) лигүүддээ тэргүүлсэн.",
    ],
    image: dreamStadiumImg,
    highlights: ["2000–2026 аваргууд", "Premier League", "La Liga · Serie A", "Bundesliga · Ligue 1"],
    sourceLabel: "Топ 5 Лиг · 2000–2026",
    hasTop5Archive: true,
  },
  {
    id: "fb-info-tactics",
    index: "02",
    category: "Тактик шинжилгээ",
    subtitle: "4-3-3 & 4-2-3-1 систем",
    title: "Тактикийн мэдээлэл",
    description:
      "Бөмбөг эзэмшилт, өндөр прессинг болон хурдан сөрөг довтолгооны үед хагас хамгаалагч, жигүүрийн довтлогчдын гүйцэтгэх үүрэг.",
    fullDetails: [
      "4-3-3 систем нь талбайн төвд гурвалжин үүсгэж богино дамжуулалтаар довтолгоо эхлүүлэх, мөн жигүүрээр хурдан нэвтрэх өндөр боломж олгодог.",
      "Өндөр прессинг (High Press) хийх үед довтлогч болон хагас хамгаалагчид өрсөлдөгчийн хамгаалалтаас гарах дамжуулалтын шугамыг зэрэг хааж, бөмбөгийг эрт булаан авдаг.",
      "Талбайн байрлалаа зөв эзлэх, бөмбөггүй үеийн шилжилт хөдөлгөөнийг цаг алдалгүй хийх нь орчин үеийн тамирчны хамгийн чухал ур чадвар юм.",
    ],
    image: heroFootballImg,
    highlights: ["4-3-3 схем", "Өндөр прессинг", "Талбайн алсын хараа", "Сөрөг довтолгоо"],
    sourceLabel: "instagram.com/teactics",
    url: "https://www.instagram.com/teactics?utm_source=ig_web_button_share_sheet&avpt=ZDNlZDc0MzIxNw==",
  },
  {
    id: "fb-info-training",
    index: "03",
    category: "Бэлтгэлийн үндэс",
    subtitle: "Техник ба биеийн хүч",
    title: "Өдөр тутмын бэлтгэлийн аргачлал",
    description:
      "Бөмбөг залгалт, нарийвчлалтай дамжуулалт, цохилтын техник болон 90 минутын тоглолтын тэсвэрийг хөгжүүлэх үндсэн дасгалууд.",
    fullDetails: [
      "Эхний хүрэлт (First Touch) болон хоёр хөлөөр жигд дамжуулалт өгөх дасгалыг өдөр бүр 20-30 минут хийх нь тоглолтын хурдыг мэдэгдэхүйц нэмэгдүүлдэг.",
      "Хурд ба тэсрэлтийн интервал гүйлт, тэнцвэр болон үе мөчний уян хатан байдлын дасгал нь бэртлээс сэргийлж, талбай дээрх хөдөлгөөнийг хөнгөн болгоно.",
      "Бэлтгэлийн дараах зөв сунгалт, усны тэнцвэр болон хангалттай амралт (8+ цаг нойр) нь булчингийн нөхөн сэргэлтийн гол түлхүүр юм.",
    ],
    image: workPortfolioImg,
    highlights: ["Эхний хүрэлт", "Хурдны интервал", "Хоёр хөлийн техник", "Сэргэлт"],
    sourceLabel: "Training & Fitness",
  },
  {
    id: "fb-info-world",
    index: "04",
    category: "Дэлхийн хөл бөмбөг",
    subtitle: "Залуу одод ба статистик",
    title: "Шинэ үеийн тамирчид ба тоглолт",
    description:
      "Олон улсын шигшээ багуудын тэмцээн, залуу авьяаслаг тамирчдын амжилтын замнал болон хөл бөмбөгийн сонирхолтой статистик.",
    fullDetails: [
      "Өнөөдрийн дэлхийн хөл бөмбөгт 17-21 насны залуу тамирчид топ лигүүд болон шигшээ багийн гарааны бүрэлдэхүүнд гол үүрэг гүйцэтгэж байна.",
      "Тоглолтын статистик үзүүлэлтүүд (xG — хүлээгдэж буй гоол, дамжуулалтын нарийвчлал, спринтийн тоо) нь тамирчны бодит үр дүнг нарийн хэмжих стандарт болсон.",
      "Мөн eFootball болон FC Mobile зэрэг спортын симуляци тоглоомууд нь залуу тоглогчдод тактик, байрлалын мэдрэмжээ хөгжүүлэх сонирхолтой орчин болж өгдөг.",
    ],
    image: youtubeStudioImg,
    highlights: ["Залуу авьяасууд", "xG статистик", "Шигшээ багууд", "eFootball & FC Mobile"],
    sourceLabel: "Global Football",
  },
];
