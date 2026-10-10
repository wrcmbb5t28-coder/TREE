import type { Lang } from "../config";
import type { Scene } from "@/components/StoryArt";

type CoverT = { change: string; hint: string; auto: string; photo: string; current: string; scenes: Record<Scene, string> };

export const coverT: Record<Lang, CoverT> = {
  ru: { change: "Сменить картинку", hint: "Выберите фотографию из этой истории или один из рисунков. «Авто» — первая фотография, а если её нет, рисунок по словам истории.", auto: "Авто", photo: "Фото", current: "сейчас",
    scenes: { river: "Река", pier: "Пристань", house: "Дом", school: "Школа", village: "Деревня", city: "Город", field: "Поле" } },
  en: { change: "Change picture", hint: "Pick a photo from this story or one of the drawings. “Auto” uses the first photo, or a drawing matched to the story's words.", auto: "Auto", photo: "Photo", current: "now",
    scenes: { river: "River", pier: "Pier", house: "House", school: "School", village: "Village", city: "City", field: "Field" } },
  de: { change: "Bild ändern", hint: "Wählen Sie ein Foto aus dieser Geschichte oder eine Zeichnung. „Auto“ nimmt das erste Foto, sonst eine Zeichnung passend zum Text.", auto: "Auto", photo: "Foto", current: "jetzt",
    scenes: { river: "Fluss", pier: "Anleger", house: "Haus", school: "Schule", village: "Dorf", city: "Stadt", field: "Feld" } },
  fr: { change: "Changer l'image", hint: "Choisissez une photo de cette histoire ou un dessin. « Auto » prend la première photo, sinon un dessin d'après le texte.", auto: "Auto", photo: "Photo", current: "actuelle",
    scenes: { river: "Rivière", pier: "Quai", house: "Maison", school: "École", village: "Village", city: "Ville", field: "Champ" } },
  it: { change: "Cambia immagine", hint: "Scegliete una foto di questa storia o un disegno. «Auto» usa la prima foto, altrimenti un disegno in base al testo.", auto: "Auto", photo: "Foto", current: "ora",
    scenes: { river: "Fiume", pier: "Molo", house: "Casa", school: "Scuola", village: "Villaggio", city: "Città", field: "Campo" } },
  es: { change: "Cambiar imagen", hint: "Elige una foto de esta historia o un dibujo. «Auto» usa la primera foto o, si no hay, un dibujo según el texto.", auto: "Auto", photo: "Foto", current: "ahora",
    scenes: { river: "Río", pier: "Muelle", house: "Casa", school: "Escuela", village: "Pueblo", city: "Ciudad", field: "Campo" } },
};
