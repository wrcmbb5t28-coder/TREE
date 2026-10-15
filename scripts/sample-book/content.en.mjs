// The Jones family book — text. Made-up family, real places and history.
export const book = {

  ui: {
    lang: "en",
    familyBook: "A family book",
    contents: "Contents",
    part: "Part",
    scan: "Scan to listen",
    numbersTitle: "The family in numbers",
    treeTitle: "Our line",
    treeLead: "The direct line from Evan Jones, a collier in the Rhondda, to Seren and Owen, with Priya’s family, the Shahs, joining in the sixth generation. The full tree holds sixty-four people.",
    joneses: "The Joneses", shahs: "The Shahs", shahsWhere: "Kampala · Leicester",
    mapTitle: "The family’s road",
    mapText: "From a pit village in the Rhondda to the Cardiff docks, a classroom in Swansea, a bedsit in London and a house in Manchester. Never more than a few hours from home, and a whole world away.",
    toMametz: "to Mametz, France →", mametzNote: "1916 · John, who didn’t come back",
    seas: ["IRISH SEA", "ENGLISH CHANNEL", "NORTH SEA"],
    furtherTitle: "Further away",
    furtherLead: "Two branches of the family reached much further: the Shahs came to Leicester from Kampala in 1972, and Peggy sailed for Adelaide in 1957. Her grandchildren are in the tree too.",
    timelineTitle: "A timeline", keyFamily: "Our family", keyWorld: "The world around us",
    castTitle: "The people in this book",
    castLead: "Drawn from photographs the family kept, at the age they are best remembered.",
    keptTitle: "Things we kept",
    keptLead: "Every one of these is still in the family. Together they are worth almost nothing, and nobody would sell any of them.",
    kept: [
      ["lamp", "Evan’s safety lamp", "Brass, from the Abergorki pit, 1880s. Cracked glass from the roof fall of 1894. Polished every Christmas Eve."],
      ["cup", "The dragon cup", "Bought for a penny at the Eisteddfod, 1905. Chipped, glued, still in use on birthdays."],
      ["gramophone", "Elsie’s gramophone", "Bought on the never-never in 1931, a shilling a week. Survived the Blitz. Plays if you wind it hard."],
      ["soldier", "The lead drummer", "Found in the rubble on Bute Street, January 1941. On Thomas’s school desk for thirty-five years."],
      ["letters", "241 letters", "From Thomas in Swansea to Gareth in London, 1982–1987, every Sunday. Kept in a biscuit tin."],
      ["phone", "Nan’s voice", "Three afternoons of recordings, 2019. Played on a pillow in Manchester most nights."],
    ],
    kitchens: "Two kitchens", youNeed: "You need", method: "Method",
    notesTitle: "Family notes", notesLead: "For the next story, the next name, the answer to one of the questions.",
    backQuote: "Sing louder, and the bombs get quieter.", backQuoteBy: "Elsie Jones, Cardiff, 1941",
    backBlurb: "Seven generations of one family, from a coal pit in the Rhondda to a terraced house in Manchester, told in their own voices. A collier’s lamp, a chipped cup, a tango on a worn-out record, two hundred and forty-one letters, and a grandmother who can still be heard laughing at bedtime.",
    tagline: "Family history, told by your family",
    signature: "Rhys",
  },

  cast: [
    ["evan", "Evan Jones", "1848–1911", "collier, Treorchy"],
    ["margaret", "Margaret Jones", "1852–1920", "kept the cocoa tin"],
    ["david", "David Jones", "1875–1940", "tenor, bought the cup"],
    ["mary", "Mary Jones", "1879–1958", "alto, second row"],
    ["john", "John Jones", "1880–1916", "missing at Mametz Wood"],
    ["william", "William Jones", "1903–1972", "walked to Cardiff"],
    ["elsie", "Elsie Jones", "1906–1990", "danced the tango"],
    ["thomas", "Thomas Jones", "1931–2009", "Mr Jones, Standard Four"],
    ["joan", "Joan Jones", "1934–2021", "Nan Joan"],
    ["peggy", "Peggy Jones", "1934–2018", "sailed to Adelaide"],
    ["gareth", "Gareth Jones", "b. 1958", "bass player, letter-keeper"],
    ["susan", "Susan Jones", "b. 1960", "the supervisor"],
    ["navin", "Navin Shah", "1930–2011", "the shop on Belgrave Road"],
    ["kokila", "Kokila Shah", "b. 1936", "Ba, maker of thepla"],
    ["mahesh", "Mahesh Shah", "b. 1958", "the boy in the blazer"],
    ["hema", "Hema Shah", "b. 1961", "Priya’s mother"],
    ["rhys", "Rhys Jones", "b. 1987", "pressed record"],
    ["priya", "Priya Jones", "b. 1989", "it’s Canberra"],
    ["seren", "Seren", "b. 2018", "drinks from the dragon cup"],
    ["owen", "Owen", "b. 2021", "asks for Nanna’s story"],
  ],
  title: "The Joneses",
  subtitle: "Seven generations of one family",
  years: "1848 – 2026",
  compiledBy: "Compiled by Rhys Jones from the voices of his family",
  dedication: ["For Seren and Owen,", "so they know where they come from.", "", "And for Nan Joan,", "who told it all before it was too late."],

  foreword: {
    title: "Before you start",
    by: "Rhys Jones, Manchester, 2026",
    paras: [
      "This book began at Nan Joan's kitchen table in Swansea in the spring of 2019. I had come to fix her boiler and stayed for three afternoons, because she started talking about the dance hall in Cardiff where her mother-in-law learned to tango, and I realised that nobody had ever written any of it down.",
      "I put my phone between the teapot and the sugar bowl and pressed record. Over the next five years the rest of the family joined in: Dad talked about London, Auntie Carys found a shoebox of letters, my father-in-law told the story of Kampala that even Priya had only heard in pieces. Each of them answered one question a week, by voice, from wherever they were.",
      "Everything in these pages comes from those recordings, from the letters and certificates the family kept, and from the parish records of the Rhondda. Where people remembered things differently, I have said so. Where we simply don't know, I have left the question open at the back of the book. Perhaps you will be the one to answer it.",
      "Some pages have a small square code in the corner. Hold your phone up to it and you will hear the person who told that story, in their own voice. That was the whole point.",
    ],
  },

  numbers: [
    ["7", "generations"],
    ["64", "people in the tree"],
    ["178", "years, from 1848 to 2026"],
    ["11", "towns and cities, on three continents"],
    ["23", "hours of recorded voices"],
    ["1", "brass lamp, still working"],
  ],

  parts: [
    {
      n: "One", title: "The Valley", years: "1848 – 1925", object: "lamp",
      intro: "The Rhondda in the second half of the nineteenth century was the busiest coalfield in the world. Villages grew up the length of the valley in a single generation, terrace above terrace, each with its pit, its chapel and its choir. The Joneses came from somewhere further west, nobody is sure where, and by 1871 they were in Treorchy.",
      stories: [
        {
          title: "The first Jones we know", who: "Evan Jones", years: "1848 – 1911", place: "Treorchy, 1859–1911",
          paras: [
            "Evan Jones went underground at the age of eleven, as a door boy, sitting alone in the dark for twelve hours to open and close a ventilation door when the coal trams came through. He was paid fourpence a day. By the time he was twenty he was a collier with his own stall at the Abergorki pit, and he stayed there for forty years.",
            "He could not read when he married, and he signed the register at Bethania Chapel with a cross. Margaret, his wife, taught him over the next winter, using the only book in the house, which was the Bible in Welsh. Their granddaughter-in-law Elsie used to say that he read it so slowly that he knew it better than the minister.",
            "What the family has of Evan is his brass safety lamp. It came down from father to son, and Thomas polished it every Christmas Eve. It still works. The glass has a hairline crack from the day in 1894 when, as Evan told it, the roof came in two yards behind him and he ran faster than he had ever run in his life, holding the lamp up in front of him like a lantern on a ship.",
            "Evan sang bass in the chapel and was said to have a voice that could be heard at the bottom of the valley. He died in 1911, of the coal dust in his lungs, and is buried in Treorchy cemetery on the hillside above the terrace where he lived.",
          ],
          quote: "Leave the coal in the pit and the worry at the door.",
          quoteBy: "Evan's saying, as remembered by his grandson William",
        },
        {
          title: "Margaret's tin bath", who: "Margaret Jones, née Price", years: "1852 – 1920", place: "Treorchy",
          paras: [
            "Every afternoon at four Margaret put the tin bath in front of the range and filled it, bucket by bucket, from the copper. Then the men came home black from the pit, one after the other, father first, then the sons, and the water got darker with every one of them. There were no pithead baths in the Rhondda until the 1930s.",
            "She had nine children. Two of them died as babies, in the same winter of 1883, of what the register calls simply 'fever'. She never spoke about them, but her daughter Hannah remembered that every year on the first of February she walked up to the cemetery alone and came back with her boots wet and said nothing at supper.",
            "Margaret took in washing for the manager's house to pay for the children's boots, and she kept the money in a cocoa tin behind the clock. When she died in 1920 the family found eleven pounds in it, which was a fortune, and a note in her careful handwriting: 'For David's boy, to stay at school.' David's boy was William. He went down the pit anyway, at fourteen. The note is still in the family Bible.",
          ],
          margin: "The note is still in the family Bible. — C.",
        },
        {
          title: "The choir and the cup", who: "David Jones", years: "1875 – 1940", place: "Mountain Ash, 1905",
          paras: [
            "David followed his father down the pit at twelve and into the chapel choir at fifteen. He had a light tenor voice, nothing like Evan's, and he was so shy that he sang with his eyes shut.",
            "In the summer of 1905 the choir went to the National Eisteddfod at Mountain Ash. It was the furthest David had ever been from home: eleven miles. He pressed his only good suit under the mattress the night before, and his mother sewed a new button on the jacket with thread that didn't quite match. They came second. David said for the rest of his life that the judge was from North Wales and couldn't be expected to know any better.",
            "He brought back a china cup with a red dragon on it, bought at a stall for a penny, for a girl called Mary Davies who sang alto in the second row. They married the next year. The cup has a chip on the rim now and a crack held together with old glue, but it has never been thrown away. Nan Joan kept it on the dresser until the day she died, and Seren drinks her milk from it on her birthday.",
          ],
          object: "cup",
        },
        {
          title: "John, who didn't come back", who: "John Jones", years: "1880 – 1916", place: "Mametz Wood, France",
          paras: [
            "David's younger brother John was the one who wanted to see the world. He joined the Welsh Regiment in the first winter of the war, and his last letter home, written in pencil on a page torn from a notebook, is dated the fifth of July 1916. It is the oldest letter the family has.",
            "Five days later the 38th Welsh Division attacked Mametz Wood on the Somme. John was listed as missing on the eleventh of July. His body was never identified, and his name is one of more than seventy thousand on the memorial at Thiepval.",
            "In 2016, a hundred years later, Gareth and Rhys drove to Mametz and found the red dragon memorial that stands on the edge of the wood. They left a stone from the hillside above Treorchy at its foot, and a photograph of the letter.",
          ],
          letter: {
            date: "5th July 1916",
            lines: ["Dear Mam,", "We are all well and in good spirits. It is very hot here and the poppies are out in the fields, you would like them. Tell David I heard a man singing Calon Lân in the next trench last night and I joined in and it was like being home.", "Don't worry about me. Give my love to Dad and to everybody at Bethania.", "Your loving son,", "John"],
          },
        },
      ],
    },
    {
      n: "Two", title: "The Docks", years: "1926 – 1945", object: "gramophone",
      intro: "In 1926 the coalfield stopped. When the General Strike collapsed, the miners stayed out alone for seven months and went back for less money, or not at all. A whole generation left the valleys. William Jones walked twenty-five miles to Cardiff, where the coal went out to the rest of the world, and the family's story moved to the sea.",
      stories: [
        {
          title: "Twenty-five miles in a day", who: "William Jones", years: "1903 – 1972", place: "Treorchy to Cardiff, 1926",
          paras: [
            "During the lockout the chapel ran a soup kitchen in the vestry, and William, who was twenty-three, carried the pans. When the pits opened again in December there was no job for him, because he had been seen at a meeting and the under-manager had a long memory.",
            "So one morning in the new year he and his friend Dai Morgan set off on foot down the valley with a sandwich each. They reached Cardiff after dark and slept in a doorway on Bute Street. William used to say he left the Rhondda with one shilling and spent it on the tram for the last mile, because his boots had given out, and that it was the best shilling he ever spent.",
            "Within a week he was trimming coal on the docks, shovelling it level in the holds of ships bound for Buenos Aires and Montevideo. It was filthier work than the pit, and he loved it, because at the end of the day he came up into the air and could see the sea.",
          ],
          quote: "One shilling and a sandwich. I spent the shilling on the tram.",
          quoteBy: "William Jones, as his son told it",
        },
        {
          title: "The dance at the Docks Hall", who: "Elsie Jones, née Hughes", years: "1906 – 1990", place: "Cardiff, 1930",
          paras: [
            "Elsie worked at the biscuit factory in Splott and went dancing every Saturday night at the Docks Hall, where a band of four played foxtrots and, when the manager wasn't looking, a tango.",
            "William could not dance at all, so he asked her to teach him. By the third Saturday he had trodden on her feet so many times that she told him she might as well marry him, since she would never be able to dance with anyone else again. They married in the spring of 1930, at St Mary's on Bute Road, and she wore a borrowed dress and her own shoes, which were ruined.",
            "Elsie laughed louder than anyone in the family has before or since. Her grandson Gareth remembers that when she laughed at the pictures, people in the front rows turned round to see who it was. She lived to be eighty-four and danced at every family wedding, including her grandson's, where she did the tango with the vicar.",
          ],
        },
        {
          title: "Two rooms off Bute Street", who: "William and Elsie", years: "1930 – 1939", place: "Tiger Bay, Cardiff",
          paras: [
            "William and Elsie's first home was two rooms in a terrace near the docks, in the part of Cardiff everyone called Tiger Bay. On one side lived a Norwegian ship's cook and his Welsh wife; on the other, a family from Aden who taught Elsie to make tea with cardamom. Thomas grew up hearing six languages in the street before he went to school.",
            "For their first anniversary William bought a wind-up gramophone on the never-never, a shilling a week, and three records. One of them was a tango. They played it so often that it wore through, and Elsie danced round the table with the baby on her hip.",
            "The gramophone survived the Blitz, two house moves and Gareth's teenage attempt to make it play punk. It sits now in Rhys and Priya's hallway in Manchester. It still plays, if you wind it hard.",
          ],
          object: "gramophone",
        },
        {
          title: "Under the stairs", who: "Thomas Jones", years: "1931 – 2009", place: "Cardiff, January 1941",
          paras: [
            "Thomas was eight when the war began and nine when it came to Cardiff. When the sirens went, the family squeezed into the cupboard under the stairs, with a candle and a tin of biscuits from Elsie's factory, and Elsie sang hymns at the top of her voice so the children wouldn't hear the bombs.",
            "On the night of the second of January 1941 the house two doors down was hit. Nobody inside was hurt, because they were in their Anderson shelter in the yard, but the front of the house fell into the street like a doll's house opening. In the morning Thomas went out and found a lead soldier in the rubble, a drummer in a red coat with half his drum gone.",
            "He gave it back to the neighbours' boy, who told him to keep it. Thomas kept it for the rest of his life. It stood on his desk at school for thirty-five years, and when children asked about it he told them this story, which is how half of Swansea knows it.",
          ],
          quote: "Sing louder, and the bombs get quieter.",
          quoteBy: "Elsie Jones, 1941",
          object: "soldier",
        },
      ],
    },
    {
      n: "Three", title: "The Classroom", years: "1946 – 1979", object: "book",
      intro: "Thomas Jones was the first in the family to stay at school past fourteen, and the first to spend his working life above ground and indoors. His generation inherited a country that was poorer and fairer than the one before, with free schools, free hospitals and a television, eventually, in every front room.",
      stories: [
        {
          title: "Mr Jones, Standard Four", who: "Thomas and Joan", years: "1955 – 1990", place: "Swansea",
          voice: "Joan tells how they met",
          paras: [
            "After National Service, which he spent in Germany looking after the tea urn of an anti-aircraft battery, Thomas trained as a teacher in Swansea. His first post was at a primary school in St Thomas, near the docks, and the school secretary was a young woman called Joan Evans.",
            "Joan told the story many times, and it always went the same way: 'He handed in his first set of reports and I sent them all back. He'd spelled necessary with two c's in every single one. He came to the office to argue, and I showed him the dictionary, and he went red to the ears, and that was that.'",
            "They married at St Thomas Church in August 1958. For thirty-five years Thomas taught Standard Four, the nine-year-olds, and he never once raised his voice. Grown men would stop him in the street and say, 'Sir, you were the one who made me read.' He always pretended to remember them, and usually he did.",
          ],
          margin: "Necessary. One c, two s's. Nan made us all learn it. — R.",
        },
        {
          title: "Peggy goes to Australia", who: "Margaret 'Peggy' Jones", years: "1934 – 2018", place: "Cardiff to Adelaide, 1957",
          paras: [
            "Thomas's little sister Peggy was the family's adventurer. In 1957, at twenty-three, she and her new husband Ron signed up for the assisted passage scheme. It cost them ten pounds each to sail to Australia, and they had to promise to stay for two years.",
            "They stayed for sixty. The family has more than two hundred of Peggy's letters, on thin blue airmail paper that folded into its own envelope, describing heat that Elsie in Cardiff could not imagine, a garden with a lemon tree, and four children who grew up saying 'Mum' with an accent nobody at home could place.",
            "Peggy came back to Wales only twice. The second time, in 1990, was for her mother's funeral, and she stood at the graveside and sang Calon Lân on her own, in a voice that, the family agreed, came straight from Evan. Her grandchildren in Adelaide are in the tree too, and three of them have recorded their own stories for this book.",
          ],
          object: "letters",
        },
        {
          title: "The night of the Moon", who: "The whole street", years: "20 – 21 July 1969", place: "Swansea",
          paras: [
            "The Joneses were the first house on their street in Swansea to rent a television, and on the night of the Moon landing half the street came round. Joan made sandwiches until the bread ran out and then made toast.",
            "Armstrong stepped onto the Moon just before four in the morning, British time. Gareth was eleven and Carys was eight, and they had been allowed to stay up. Carys fell asleep on the rug at three. Gareth stayed awake and remembers his father, who had grown up under the stairs in the Blitz, standing in front of the set with a cup of cold tea in his hand and saying quietly, to nobody, 'Well. Well, well.'",
          ],
        },
      ],
    },
    {
      n: "Four", title: "Leaving Home", years: "1972 – 2010", object: "guitar",
      intro: "In the last decades of the century both sides of the family were on the move: one young man from Swansea to London with a guitar, and one small boy from Kampala to Leicester with a suitcase. They never met. Their children did.",
      stories: [
        {
          title: "London", who: "Gareth Jones", years: "born 1958", place: "London, 1982",
          voice: "Gareth tells it himself",
          paras: [
            "I went to London in 1982 with a bass guitar and a sleeping bag. Dad drove me to the station and didn't say very much, which was how he said most things. I lived in a bedsit in Camden with a gas meter that ate fifty-pence pieces, played in a band called The Wet Sundays that nobody remembers, and worked nights sorting post at Mount Pleasant.",
            "That's where I met Susan. She was the supervisor on my section and she told me off, in my second week, for reading other people's postcards. I told her I was checking the spelling, for my father. She didn't believe me, but she laughed, and I asked her out on the strength of the laugh.",
            "The band split up in 1984. Susan and I didn't. We moved north when Rhys was born, because a two-room flat in London was no place for a baby, and Manchester had the best music in the country anyway. I still play the bass. Badly.",
          ],
        },
        {
          title: "Eat properly. Dad.", who: "Thomas to Gareth", years: "1982 – 1987", place: "Letters",
          paras: [
            "Every Sunday evening for five years Thomas sat at the kitchen table in Swansea and wrote to his son in London. The letters are short, a page at most, in the round, even handwriting he used for the blackboard. They report the weather, the rugby, what Joan cooked, who had died, and how the roses were doing.",
            "Gareth kept all of them in a biscuit tin. There are two hundred and forty-one. Every single one ends the same way.",
          ],
          letter: {
            date: "Sunday 14th November 1982",
            lines: ["Dear Gareth,", "Swansea lost to Neath on Saturday, so we will say no more about that. Your mother has made a cawl and wishes you were here to eat it. The roses are finished for the year.", "Mrs Pritchard at number 12 asks if you are famous yet. I said not yet.", "Eat properly.", "Dad"],
          },
        },
        {
          title: "Kampala to Leicester", who: "Mahesh Shah", years: "born 1958", place: "Kampala to Leicester, 1972",
          voice: "Mahesh tells it in his own words",
          paras: [
            "I was fourteen when Idi Amin gave us ninety days to leave Uganda. My father had a shop on Kampala Road, cloth and sewing machines, that his father had opened in 1931. We were allowed to take fifty pounds and two suitcases. My mother sewed her gold bangles into the lining of my school blazer, and I wore that blazer on the plane in October, which was the first time I had been cold in my life.",
            "We spent five weeks in a resettlement camp at an old airbase in Suffolk. Everyone told us not to go to Leicester. The council there had even put advertisements in the newspapers in Uganda telling us not to come. So of course we went to Leicester, because that is where my uncle was.",
            "My father opened a corner shop on Belgrave Road in 1974. He worked in it seven days a week for twenty-five years, and he never once complained about anything except the English weather and the cricket. I became an accountant, which pleased him more than anything. When Priya married a Welshman, he said, 'At least they also like to sing.'",
          ],
          quote: "Fifty pounds, two suitcases, and my mother's gold in my blazer.",
          quoteBy: "Mahesh Shah",
        },
      ],
    },
    {
      n: "Five", title: "Now", years: "2010 – 2026", object: "phone",
      intro: "The newest chapter of the family is being written in Manchester, in a terraced house with a wind-up gramophone in the hall, a red dragon cup on the shelf and a small boy who asks every night for his great-grandmother's voice.",
      stories: [
        {
          title: "Two weddings in one weekend", who: "Rhys and Priya", years: "June 2015", place: "Leicester and Swansea",
          paras: [
            "Rhys and Priya met at university in Manchester, in a queue for a pub quiz, arguing about the capital of Australia. (It is Canberra. Priya was right.) They were married in June 2015, twice: on the Saturday in Leicester, in red and gold, with four hundred guests and a horse, and on the Sunday in Swansea, in the same church as Thomas and Joan, with sixty guests and a choir.",
            "Joan, who was eighty-one, said afterwards that it was the best weekend of her life and that she had never eaten so much in two days. Mahesh made a speech in three languages. Elsie's gramophone was carried into the hall and played the tango, and Gareth and Susan danced it, with considerably more skill than William ever managed.",
          ],
          margin: "The horse's name was Raja. He ate the flowers. — P.",
        },
        {
          title: "Nan's voice", who: "Rhys Jones", years: "born 1987", place: "Manchester, 2024",
          voice: "Nan Joan, recorded in 2019",
          paras: [
            "In the spring of 2019 I sat with Nan Joan at her kitchen table in Swansea and recorded her for three afternoons. She told me about the dances, the war, Grandad Tom's two c's, and Peggy singing at the graveside. Sometimes she stopped and said, 'Turn that thing off a minute,' and told me something that isn't in this book and never will be.",
            "She died two years later, at eighty-seven. Owen was born the same year, and never met her.",
            "But every night, when the light is off, Owen asks for 'Nanna's story'. We put the phone on the pillow and he listens to her tell the one about the dance hall, where William trod on Elsie's feet. He knows exactly when she is going to laugh, and he laughs a second before she does.",
            "One day his own children will hear her laugh too. That is what this book is for.",
          ],
          object: "phone",
        },
      ],
    },
  ],

  sayings: {
    title: "Things we say",
    note: "Every family has its own language. These are ours, collected from four generations.",
    items: [
      ["Leave the coal in the pit and the worry at the door.", "Evan, 1890s. Said by every generation since, usually about work."],
      ["Necessary: one c, two s's.", "Joan. Recited by all her grandchildren at spelling tests."],
      ["Sing louder.", "Elsie. The family answer to almost any difficulty."],
      ["Well. Well, well.", "Thomas. Used for the Moon landing and for very good exam results."],
      ["Eat properly.", "Thomas, at the end of 241 letters. Now said by Gareth to Rhys, and by Rhys to Seren."],
      ["At least they also like to sing.", "Mahesh Shah, on his daughter marrying into the family."],
      ["It's Canberra.", "Priya. Said whenever Rhys is sure about something."],
    ],
  },

  recipes: [
    {
      title: "Nan Joan's Welsh cakes", from: "Joan Jones, Swansea",
      ingredients: ["225 g self-raising flour", "110 g salted butter, cold", "85 g caster sugar, and more to dust", "a good handful of currants", "1 egg", "a pinch of nutmeg", "a splash of milk"],
      method: [
        "Rub the butter into the flour until it looks like breadcrumbs. Stir in the sugar, the nutmeg and the currants.",
        "Beat in the egg, and just enough milk to make a firm dough, like pastry.",
        "Roll it out to the thickness of your little finger and cut rounds with a glass.",
        "Cook on a hot bakestone, or a heavy frying pan, three minutes a side, until golden. Dust with sugar while they are warm. Eat at least one standing up.",
      ],
      note: "Nan never weighed anything: 'a cup of this, a knob of that'. Dad stood next to her one Sunday in 2004 with kitchen scales and wrote it all down while she pretended not to notice.",
    },
    {
      title: "Ba's methi thepla", from: "Kokila Shah, Leicester",
      ingredients: ["200 g chapati flour", "a big bunch of fresh fenugreek (methi), chopped", "3 tbsp plain yoghurt", "½ tsp turmeric", "1 tsp chilli powder", "1 tsp sesame seeds", "2 tbsp oil, and more for cooking", "salt"],
      method: [
        "Mix the flour, spices, sesame, salt and fenugreek. Add the yoghurt and oil, then a little water at a time to make a soft dough. Rest it for twenty minutes.",
        "Divide into small balls and roll each one thin and round, dusting with flour.",
        "Cook on a hot tawa or frying pan, turning once, then brush with oil and press with a spoon until golden spots appear on both sides.",
      ],
      note: "Ba packed thepla for every journey, including the plane from Entebbe in 1972. They keep for days. Seren calls them 'Gujarati Welsh cakes', which is not correct but has been allowed.",
    },
  ],

  timeline: [
    [1848, "Evan Jones born", "family"], [1859, "Evan goes underground, aged 11", "family"],
    [1883, "Treorchy Male Choir founded", "world"], [1905, "David sings at the Eisteddfod, Mountain Ash", "family"],
    [1914, "First World War begins", "world"], [1916, "John missing at Mametz Wood", "family"],
    [1926, "General Strike; William walks to Cardiff", "family"], [1930, "William and Elsie marry", "family"],
    [1931, "Navin Shah's father opens a shop in Kampala", "family"], [1941, "Cardiff Blitz; the lead soldier", "family"],
    [1948, "National Health Service founded", "world"], [1957, "Peggy sails to Australia for £10", "family"],
    [1958, "Thomas and Joan marry", "family"], [1969, "Moon landing, watched by half the street", "world"],
    [1972, "The Shahs expelled from Uganda", "family"], [1982, "Gareth goes to London", "family"],
    [1987, "Rhys born", "family"], [2015, "Two weddings in one weekend", "family"],
    [2018, "Seren born", "family"], [2019, "Nan Joan recorded", "family"], [2021, "Owen born; Joan dies", "family"],
    [2026, "This book", "family"],
  ],

  questions: {
    title: "What we still don't know",
    note: "A family history is never finished. These are the questions nobody has been able to answer yet. If you find out, add it to the tree.",
    items: [
      "Where did the Joneses live before Treorchy? Evan's birth certificate says 'Carmarthenshire' and nothing more.",
      "Who were Margaret Price's parents? Her marriage record names her father as 'Thomas Price, labourer', and there are eleven of those.",
      "What happened to the photograph of the 1905 choir that David kept in his Bible? Hannah remembered it. Nobody has seen it since 1940.",
      "Did John write any other letters? His fiancée, Annie, is mentioned once and never again.",
      "What was the tango on Elsie's record? The label wore off long ago.",
      "What was the name of the shop on Kampala Road?",
    ],
  },

  ask: {
    title: "Questions to ask while you still can",
    note: "For Seren and Owen, and for anyone else holding this book. Ask the people you love. Record the answers.",
    items: [
      "What is the first thing you remember?",
      "What did your house smell like when you were small?",
      "Who taught you to dance, or cook, or drive?",
      "What were you most afraid of, and what happened?",
      "What did you do with your first wages?",
      "What do you want us to remember about you?",
    ],
  },

  afterword: {
    title: "A note on how this book was made",
    paras: [
      "The stories in this book were told by voice, one question at a time, over five years, by eleven members of the family in Manchester, Swansea, Leicester, Berlin and Adelaide. Treename turned the recordings into text, translated where needed, and kept every voice. The family checked every page.",
      "The facts were checked against the family's own papers and against public records: the 1871 and 1881 censuses, the parish registers of Treorchy and Cardiff, the Commonwealth War Graves Commission, and the passenger lists of the SS Orion.",
      "The tree in this book holds sixty-four people. It is still growing.",
    ],
  },

  colophon: [
    "The Joneses · Seven generations of one family",
    "Made with Treename · treename.ai",
    "First edition, 2026",
    "This is a sample book. The Jones and Shah families are invented; the places and the history are real.",
  ],

  // the tree (oldest first)
  line: [
    { h: ["Evan Jones", "1848–1911"], w: ["Margaret Price", "1852–1920"], sibs: ["Hannah 1877–1952", "John 1880–1916"] },
    { h: ["David Jones", "1875–1940"], w: ["Mary Davies", "1879–1958"], sibs: ["Gwen 1907–1999", "Idris 1910–1979"] },
    { h: ["William Jones", "1903–1972"], w: ["Elsie Hughes", "1906–1990"], sibs: ["Peggy 1934–2018"] },
    { h: ["Thomas Jones", "1931–2009"], w: ["Joan Evans", "1934–2021"], sibs: ["Carys b. 1961"] },
    { h: ["Gareth Jones", "b. 1958"], w: ["Susan Clarke", "b. 1960"], sibs: ["Anna b. 1990"] },
    { h: ["Rhys Jones", "b. 1987"], w: ["Priya Shah", "b. 1989"], sibs: [] },
  ],
  shah: [["Navin Shah", "1930–2011"], ["Kokila Shah", "b. 1936"], ["Mahesh Shah", "b. 1958"], ["Hema Shah", "b. 1961"]],
  children: [["Seren", "b. 2018"], ["Owen", "b. 2021"]],

  stops: [
    { name: "Treorchy", note: "the pit and the chapel", lon: -3.505, lat: 51.659, year: "1859" },
    { name: "Mametz", note: "John, 1916", lon: 2.73, lat: 50.0, year: "1916" },
    { name: "Cardiff", note: "the docks", lon: -3.18, lat: 51.48, year: "1926" },
    { name: "Swansea", note: "the classroom", lon: -3.94, lat: 51.62, year: "1955" },
    { name: "London", note: "a bedsit and a band", lon: -0.13, lat: 51.51, year: "1982" },
    { name: "Leicester", note: "the shop on Belgrave Road", lon: -1.13, lat: 52.64, year: "1972" },
    { name: "Manchester", note: "home now", lon: -2.24, lat: 53.48, year: "1987" },
  ],
  far: [
    { name: "Kampala", note: "the Shahs, until 1972", lon: 32.58, lat: 0.35 },
    { name: "Adelaide", note: "Peggy, from 1957", lon: 138.6, lat: -34.93 },
  ],
};
