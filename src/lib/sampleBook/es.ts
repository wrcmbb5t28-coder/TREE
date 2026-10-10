import type { SampleBookText } from "./types";

const es: SampleBookText = {
  title: "Los Müller",
  subtitle: "Quince generaciones de una familia",
  years: "1620 — 2026",
  motto: "El pan crece donde se siembra",
  dedication: "Para Leon y Sofia, para que sepan de dónde vienen.\nY para todos los que contaron mientras nosotros escribíamos.",
  contents: "Índice",
  treeTitle: "Nuestra línea",
  treeNote: "La línea directa desde Hans Müller, molinero cerca de Berna, hasta Leon y Sofia. En el árbol de la familia hay más de cien personas más: hermanos, hermanas y sus familias.",
  treeFrom: "de",
  mapTitle: "El camino de la familia",
  mapNote: "Casi cuatrocientos años y nueve mil kilómetros: de Suiza al Volga, a Siberia y a la estepa kazaja, y de vuelta a Suiza.",
  stops: [
    "Berna — el molino del Aar",
    "Mannheim — después de la riada",
    "Sarátov — una colonia en el Volga",
    "Odesa — junto al mar Negro",
    "Omsk — una granja en Siberia",
    "Karagandá — la deportación",
    "Colonia — el regreso",
    "Zug — otra vez Suiza",
  ],
  recipe: {
    chapter: "Tradiciones",
    title: "La tarta de cerezas de la abuela Lidia",
    who: "Lidia Müller, de soltera Schmidt, 1904–1979",
    ingredientsTitle: "Necesitas",
    ingredients: ["500 g de harina", "250 g de mantequilla", "150 g de azúcar", "3 huevos", "una pizca de sal", "1 kg de cerezas sin hueso", "2 cucharadas de sémola, para que no se salga"],
    text: "Copiada de su cuaderno, que viajó con la familia de Omsk a Karagandá en el hatillo de las fotos. Batir la mantequilla con el azúcar, añadir los huevos, luego la harina y la sal. Extender dos tercios de la masa en el molde, espolvorear sémola y poner las cerezas. Con el resto cortar tiras y colocarlas en rejilla. Hornear cuarenta minutos, hasta que la rejilla esté dorada.",
    note: "En Omsk usaba cerezo aliso; en Karagandá, orejones. En Zug, Giulia la hace con cerezas, como debía ser.",
  },
  stories: [
    {
      scene: "river", chapter: "Los orígenes", title: "El molino cerca de Berna", who: "Jakob Müller, 1648–1712", caption: "El Aar, 1674",
      text: "El primer Müller que conocemos por su nombre tenía un molino en el río Aar, cerca de Berna. No quedan documentos: solo el apellido, que significa «molinero», y una historia que pasó de abuelo a nieto. En la primavera de 1674 el agua subió tanto que se llevó la rueda junto con el granero. Jakob y su mujer Verena cargaron en un carro lo que quedaba y se fueron al norte, al Palatinado, donde el príncipe elector llamaba a colonos y prometía tierras.",
      quote: "El agua quita, y el agua da.",
    },
    {
      scene: "river", chapter: "El camino", title: "El camino al Volga", who: "Georg y Margaretha Müller, 1766", caption: "Lübeck — Sarátov, 1766",
      text: "En 1766, en Darmstadt, Georg leyó el manifiesto de la emperatriz de Rusia: tierra, treinta años sin impuestos y libertad de culto. En primavera partió con Margaretha y el pequeño Friedrich, de cuatro años: por mar de Lübeck a Kronstadt, y luego por ríos y en trineo hasta Sarátov. El viaje duró casi un año. En la familia se decía que Margaretha llevó solo un baúl de semillas y la Biblia, y que las semillas brotaron ya la primavera siguiente.",
    },
    {
      scene: "village", chapter: "La infancia", title: "Una colonia en el Volga", who: "Heinrich Müller, 1790–1858", caption: "Una colonia cerca de Sarátov",
      text: "Heinrich nació ya en la colonia. En casa se hablaba alemán, en el mercado ruso, y en la iglesia se cantaban los viejos himnos de Hesse. En verano los niños cuidaban gansos en los prados junto al río; en invierno iban a la escuela parroquial: catecismo, cuentas y caligrafía. El cuaderno de Heinrich se perdió, pero su refrán quedó: todos sus nietos lo repetían.",
      quote: "El pan crece donde lo has sembrado.",
    },
    {
      scene: "pier", chapter: "El amor", title: "La polaca de Cracovia", who: "Zofia Müller, de soltera Kowalska, 1822–1891", caption: "Odesa, el muelle, 1844",
      text: "Zofia llegó a Odesa para trabajar en la tienda de su tío y, la primera semana, conoció en el muelle a Andreas Müller, que cargaba grano en un vapor. Su familia no quería a un colono alemán; la de él, a una católica. Se casaron casi sin invitados y vivieron juntos cuarenta y seis años. El anillo de Zofia, con su pequeño granate, lo guarda hoy la tía Elena en Hannover.",
    },
    {
      scene: "river", chapter: "La partida", title: "El hermano que se fue a Nebraska", who: "Johann Müller, 1876–1950", caption: "Bremen — Nueva York, 1903",
      text: "En 1903 Johann, el hermano menor del bisabuelo Karl, zarpó de Bremen a Nueva York y siguió en tren hasta Lincoln, Nebraska, donde ya vivían otros alemanes del Volga. Escribía una vez al año, en Navidad, y siempre metía en el sobre una flor de la pradera seca. La última carta llegó en 1938. Aún no hemos encontrado a sus descendientes; quizá un día ellos encuentren este libro.",
    },
    {
      scene: "village", chapter: "El trabajo", title: "Una granja en Siberia", who: "Karl y Natalja Müller, 1898", caption: "Cerca de Omsk, 1910",
      text: "Karl y Natalja se mudaron cerca de Omsk cuando allí se repartía tierra. El primer invierno vivieron en una choza excavada en el suelo y se calentaban con estiércol seco; en primavera Karl levantó él mismo una casa de alerce. En 1910 tenían doce vacas y una pequeña lechería. La mantequilla iba en barriles a la estación y de allí, dicen, hasta Dinamarca e Inglaterra. Natalja llevaba las cuentas en un cuaderno grueso que todavía existe.",
    },
    {
      scene: "city", chapter: "Los años duros", title: "Cómo llegó el bisabuelo a Karagandá", who: "Viktor Müller, 1928–2001", caption: "Karagandá, 1941",
      text: "En septiembre de 1941 toda la familia Müller fue enviada de Omsk a Kazajistán. Viktor tenía trece años. Recordaba el vagón de mercancías, la estepa sin un solo árbol y a su madre, que llevó todo el viaje en el regazo el hatillo de las fotos. Desde los quince trabajó en la mina. No le gustaba hablar de aquellos años; solo una vez, ya mayor, le dijo una frase a su nieto.",
      quote: "Sobrevivimos porque nos mantuvimos juntos.",
    },
    {
      scene: "school", chapter: "El amor", title: "La maestra de Almaty", who: "Aigul Müller, de soltera Zhanibekova, 1931–2010", caption: "Escuela nocturna, 1952",
      text: "A Aigul la enviaron a Karagandá a enseñar ruso en una escuela nocturna. Viktor fue a sacarse el título: cansado después del turno, con polvo de carbón en las pestañas. Un año después se casaron. La abuela se reía de que fue el único alumno que nunca aprobó su dictado. Pero cada mañana, hasta la vejez, le preparaba té con leche, como se toma en Almaty.",
    },
    {
      scene: "city", chapter: "La partida", title: "El noventa y dos", who: "Andrej Müller, 1955", caption: "Karagandá — Colonia, 1992",
      text: "Nos fuimos a Alemania con tres maletas y una caja de fotos. En la estación mi padre dijo: «Hace doscientos años vinimos aquí; ahora volvemos». En Colonia pasamos el primer año en un albergue para repatriados. Por las noches estudiaba alemán y de día trabajaba en la obra, aunque en casa había sido ingeniero. Michael entró en una escuela alemana y a los seis meses ya me corregía la gramática.",
      voice: "Escuchad a Andrej contarlo",
    },
    {
      scene: "river", chapter: "La nueva generación", title: "Zug y nuestros hijos", who: "Michael Müller, 1981", caption: "Berna, el Aar, 2019",
      text: "En 2015 nos mudamos a Zug. Leon tenía cuatro años; Sofia aún no había nacido. Un día fuimos a Berna y encontramos en el Aar el lugar donde, según la leyenda familiar, estaba el molino. Ahora pasa por allí un carril bici. Casi cuatrocientos años después, la familia volvió a donde empezó. Leon preguntó: «¿Y ahora qué somos?» Todavía pienso qué contestarle.",
      voice: "La voz de Michael, grabada en 2026",
    },
  ],
  endTitle: "Este libro es un ejemplo",
  endText: "Los Müller son inventados, pero el libro es real: así reúne Treename las historias que tu familia cuenta de viva voz, con el árbol, el mapa y las fotos. El tuyo se hará con vuestras propias historias.",
  colophon: "El libro de la familia Müller · hecho con Treename · Zug, 2026",
  ui: {
    facts: ["generaciones", "personas en el árbol", "países", "historias"],
    back: "← Inicio", start: "Empezar mi libro", prev: "Atrás", next: "Siguiente", open: "Abrir el libro",
    page: "Página", of: "de", hint: "Pasa las páginas con las flechas, deslizando o con los botones", chapter: "Capítulo", listen: "Escanea y escucha",
    eyebrow: "Libro de ejemplo", lead: "Así puede ser el libro de tu familia: historias contadas de viva voz, el árbol, el mapa del camino familiar y fotos. Hojea el libro de la familia inventada Müller.", cta: "Hojear un libro de ejemplo",
  },
};
export default es;
