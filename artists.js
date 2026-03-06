// ══════════════════════════════════════════════════════════════════
// PERFILES DE ARTISTAS — EUPB MUSEO
// ══════════════════════════════════════════════════════════════════
// Cada clave es el slug del artista (mismo que usa slugToArtist)
// Si un artista NO tiene entrada aquí, su ficha funciona normal
// Solo rellena los campos que quieras — todos son opcionales
// ══════════════════════════════════════════════════════════════════

const ARTIST_PROFILES = {
  "cecilio-g": {
    photo: "https://i1.sndcdn.com/artworks-000143573853-x52its-t500x500.jpg",
    realName: "Juan Cecilia Ruiz",
    bio: "Uno de los artistas más controvertidos y carismáticos del nuevo rap español. Cofundador de PXXR GVNG y figura clave de la escena trap en Barcelona. Su paso por la cárcel marcó un punto de inflexión en su carrera y su música.",
    crew: "PXXR GVNG",
    social: {
      instagram: "https://instagram.com/ceciliogtherealgoat",
      spotify: "https://open.spotify.com/artist/4MqhkWZdPBsXDVFjjGKJCl",
      youtube: "https://www.youtube.com/channel/UCfz2JqYf5-_aryESQvczr6A",
    },
    videos: [
      { title: "Million Dollar Baby", youtube: "Ym59_2x6zgU" },
      { title: "THE ANIMALS", youtube: "XSW9gQ7yr6M" },
      { title: "24 7", youtube: "_oSYSXwuAOM" },
    ],
    photos: [
      "https://i.postimg.cc/FsJcYc8f/Captura-de-pantalla-2026-03-04-110210.png",
      "https://i.postimg.cc/otra-foto/foto2.png",
      "https://i.postimg.cc/otra-mas/foto3.png",
    ],
  },

  "yung-beef": {
    photo: "https://i.postimg.cc/placeholder/yung-beef.jpg",
    realName: "Fernando Gálvez Gómez",
    bio: "Pionero absoluto del trap en España y cabeza visible de La Vendición Records. Desde Granada revolucionó el sonido urbano español con una estética y actitud sin precedentes. Su influencia se extiende a toda la nueva generación.",
    crew: "La Vendición / PXXR GVNG",
    social: {
      instagram: "https://instagram.com/yaborncasanova",
      spotify: "https://open.spotify.com/artist/6KGMCtcAbsREWwiA1bZpNq",
      youtube: "https://youtube.com/@YungBeef",
      bandcamp: "https://yungbeef.bandcamp.com",
    },
    videos: [
      { title: "A.D.R.O.M.I.C.F.M.S.", youtube: "n1iLXrNBFqQ" },
      { title: "Después de Morirme", youtube: "YlJRFC9JxmQ" },
      { title: "Bien Duro con Kaydy Cain", youtube: "gQFPflxrXjw" },
    ],
    photos: [],
  },

  dano: {
    photo: "https://i.postimg.cc/placeholder/dano.jpg",
    realName: "Danilo Amerise Díaz",
    bio: "MC, productor y director madrileño. Pilar fundamental de Ziontifik y uno de los raperos más respetados del panorama. Su tercer LP 'Istmo' consolidó su estatus como referente del rap con alma, producido casi íntegramente por él mismo.",
    crew: "Ziontifik",
    social: {
      instagram: "https://instagram.com/dano",
      spotify: "https://open.spotify.com/artist/464iXBDj4uTNqCMKw2avJB",
    },
    videos: [
      { title: "Albatros", youtube: "3W5qGwPeL5M" },
      { title: "35 Grados con Rels B", youtube: "pQWjr3zYBqM" },
      { title: "Pétalos Doblados con Israel B", youtube: "v8k7gDGbQKo" },
    ],

    photos: [
      "https://i.postimg.cc/FsJcYc8f/Captura-de-pantalla-2026-03-04-110210.png",
      "https://i.postimg.cc/otra-foto/foto2.png",
      "https://i.postimg.cc/otra-mas/foto3.png",
    ],
  },

  skyhook: {
    photo: "https://i.postimg.cc/placeholder/skyhook.jpg",
    realName: "Pablo de Echave",
    bio: "Beatmaker y productor zaragozano, uno de los más prolíficos de la escena española. Su disco Moonchies reunió a lo mejor de la escena nacional en un viaje intergaláctico de 13 temas que se convirtió en un clásico instantáneo.",
    crew: "Helsinki Pro",
    social: {
      instagram: "https://instagram.com/skyhxxk",
      spotify: "https://open.spotify.com/artist/2jTbPjLVPxMmvNPTdBqFfW",
      bandcamp: "https://skyhxxk.bandcamp.com",
    },
    videos: [
      { title: "A Escondidas con Morad", youtube: "JvPJKxG1rFQ" },
      {
        title: "Dentro con Sticky M.A. y Pedro LaDroga",
        youtube: "1r9Z3yJxZHM",
      },
      { title: "Adderall con Yung Beef", youtube: "7hRnAF0aFGE" },
    ],
    photos: [],
  },

  rosalia: {
    photo: "https://i.postimg.cc/placeholder/rosalia.jpg",
    realName: "Rosalía Vila Tobella",
    bio: "Artista barcelonesa que fusionó el flamenco con la electrónica y la música urbana. Su álbum El Mal Querer, basado en la novela occitana del siglo XIII 'Flamenca', la catapultó a la fama mundial y redefinió los límites del pop español.",
    social: {
      instagram: "https://instagram.com/rosalia.vt",
      spotify: "https://open.spotify.com/artist/7ltDVBr6mKbRvohxheJ9h1",
      youtube: "https://youtube.com/@Rosalia",
    },
    videos: [
      { title: "Malamente (Cap. 1: Augurio)", youtube: "Rht7rBHuXW8" },
      { title: "Pienso en Tu Mirá (Cap. 3: Celos)", youtube: "p_4coiRG_BI" },
      { title: "Di Mi Nombre (Cap. 8: Éxtasis)", youtube: "maBpafBMOZM" },
    ],
    photos: [],
  },

  morad: {
    photo: "https://i.postimg.cc/placeholder/morad.jpg",
    realName: "Morad El Khattouti El Horami",
    bio: "Rapero de L'Hospitalet de Llobregat de origen marroquí. Empezó enviando audios de rap por WhatsApp a sus amigos del barrio de La Florida. Su debut M.D.L.R (Mec de la Rue) puso la primera piedra de una carrera que lo llevaría a ser el español más escuchado en Spotify.",
    crew: "M.D.L.R",
    social: {
      instagram: "https://instagram.com/moaborncasanova",
      spotify: "https://open.spotify.com/artist/5VtbiEJfwHBVRyAdSVpZgI",
      youtube: "https://youtube.com/@Morad",
    },
    videos: [
      { title: "M.D.L.R", youtube: "abc123" },
      { title: "A Escondidas (con $kyhook)", youtube: "JvPJKxG1rFQ" },
      { title: "Cuidadito", youtube: "def456" },
    ],
    photos: [],
  },

  "sticky-m-a": {
    photo: "https://i.postimg.cc/placeholder/sticky.jpg",
    realName: "Manuel Fernández",
    bio: "MC madrileño y miembro de Agorazein. Su estilo lisérgico y melódico, bañado en autotune, definió una nueva forma de hacer trap en España. La 5ta Dimensión junto a Steve Lean fue su obra cumbre.",
    crew: "Agorazein",
    social: {
      instagram: "https://instagram.com/stickym.a",
      spotify: "https://open.spotify.com/artist/3YCKuqOmSWkCOiNRwBJmm1",
    },
    videos: [
      { title: "Rockestar", youtube: "abc123" },
      { title: "Piensa en Mí", youtube: "def456" },
    ],
    photos: [],
  },

  "pedro-ladroga": {
    photo: "https://i.postimg.cc/placeholder/pedro.jpg",
    realName: "Pedro Bravo",
    bio: "Rapero, productor y artista multidisciplinar sevillano. Pionero del sonido vaporoso y sureño en el rap español. Todo un creador total: graba, mezcla, produce, diseña y dirige sus propios videoclips. Eurococa es puro viaje introspectivo bañado en THC.",
    crew: "LaDrogaLab / Helsinki Pro",
    social: {
      instagram: "https://instagram.com/petergriffa",
      spotify: "https://open.spotify.com/artist/1a2b3c4d",
      bandcamp: "https://ladrogalab.bandcamp.com",
    },
    videos: [
      { title: "Me Kieren Exa'", youtube: "7EOKdcEI3F8" },
      { title: "Vampiro Joven", youtube: "abc123" },
    ],
    photos: [],
  },

  anb: {
    photo:
      "https://images.genius.com/73f1f0e7c9ae7ea4f13df890cc862760.562x562x1.jpg",
    realName: "ANB Skuad",
    aliases: [
      "ANB Blue Dragon",
      "ANBCLUB1017",
      "Anubis Club",
      "Long-Chicken Boys",
      "BlueDragon Squad",
      "GaoGang",
      "ChikenKartel1017",
    ],
    bio: "Colectivo de trap callejero fundado en Madrid en 2012. Una de las crews del underground español con más integrantes a lo largo de su historia. Su sonido bebe del trap americano más raw, con letras de barrio, vida en el bloque y supervivencia urbana. Activos desde sus inicios hasta hoy. Madrid Sur",
    members: [
      "CreepyBoy",
      "SouzReptil1k17",
      "ButtonBricks",
      "OgSur",
      "28minimal",
      "Gonxo",
      "SasoBricks",
      "ElViejoNick",
      "HachaDastral",
      "GucciMazaar",
      "BabyGucci",
      "BabyPantera",
      "leodaleo",
      "DocGucci",
      "Farlos Farina",
      "AllikWhoudini",
    ],
    crew: "ANB Skuad",
    social: {
      instagram: "https://instagram.com/anbofficial1017",
      spotify: "https://open.spotify.com/artist/1gZ3en4wy2n1l6ABn7Q1ja",
      youtube: "https://www.youtube.com/@ANBTV",
      soundcloud: "https://soundcloud.com/anbskuad",
    },
    videos: [
      { title: "We On The Block (No Sleep Rmx)", youtube: "c4CXdcTrGHE" },
      { title: "T-MAC", youtube: "zleiOFKocLE" },
      { title: "Gangshit", youtube: "xNBmn63UC2I" },
    ],
    photos: [
      "https://images.genius.com/42be766a642b67da8a495879e5957f35.660x571x1.jpg",
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // PLANTILLA VACÍA — copiar y rellenar para nuevos artistas
  // ══════════════════════════════════════════════════════════════
  /*
  "slug-del-artista": {
    photo: "",           // URL foto del artista (no cover de disco)
    realName: "",        // Nombre real
    bio: "",             // 2-3 frases
    tags: [],            // Estilos: "trap", "boom bap", "reggaetón"...
    crew: "",            // Colectivo: "La Vendición", "Ziontifik"...
    social: {
      instagram: "",
      spotify: "",
      youtube: "",
      bandcamp: "",
      soundcloud: "",
      twitter: "",
    },
    videos: [
      // { title: "Nombre del tema", youtube: "ID_del_video" },
    ],
    photos: [
      // "url-foto1.jpg", "url-foto2.jpg", ...
    ],
  },
  */
};

export default ARTIST_PROFILES;
