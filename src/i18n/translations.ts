// ============================================================
// Translations — Italian (default) + English
// ============================================================

import type { Translations } from "../types/translations";

export const translations: Translations = {
  it: {
    // Navbar
    nav: {
      home: "Home",
      portfolio: "Portfolio",
      about: "Chi Sono",
      contact: "Contatti",
      gallery: "Galleria",
    },

    // Hero
    hero: {
      eyebrow: "Portfolio Fotografico",
      title1: "Nai",
      title2: "tiry",
      description: "Catturando emozioni, luce e storie attraverso l'obiettivo. Basata in Italia, disponibile in tutto il mondo.",
      cta: "Esplora i Miei Lavori →",
      scroll: "Scorri",
    },

    // Featured section
    featured: {
      subtitle: "I Più Amati",
      title1: "Lavori",
      title2: "in Evidenza",
      viewAll: "Vedi Galleria Completa →",
    },

    // About section
    about: {
      subtitle: "Chi Sono",
      title1: "L'Occhio Dietro",
      title2: "l'Obiettivo",
      paragraph1: "Ciao, sono Isabel — una giovane fotografa italiana con una profonda passione per catturare la bellezza nei momenti quotidiani. Dai ritratti baciati dal sole alle scene urbane cariche di atmosfera, il mio lavoro mescola la luce naturale con l'emozione autentica.",
      paragraph2: "Credo che ogni fotografia debba raccontare una storia. Che si tratti di un matrimonio, di un editoriale creativo o della magia silenziosa di un paesaggio, metto il cuore in ogni singolo scatto.",
      stat1Label: "Progetti",
      stat2Label: "Anni di Esperienza",
      stat3Label: "Clienti Felici",
    },

    // Contact section
    contact: {
      subtitle: "Contattami",
      title1: "Creiamo Qualcosa",
      title2: "di Bello",
      paragraph: "Hai un progetto in mente? Mi piacerebbe sentirti. Che si tratti di una sessione ritratto, di un evento o di una collaborazione creativa — facciamolo accadere.",
      namePlaceholder: "Il Tuo Nome",
      emailPlaceholder: "La Tua Email",
      subjectPlaceholder: "Oggetto",
      messagePlaceholder: "Raccontami del tuo progetto...",
      sendButton: "Invia Messaggio",
      location: "Foggia, Italia",
    },

    // Footer
    footer: {
      rights: "© 2026 Naitiry. Tutti i diritti riservati.",
    },

    // Gallery page
    gallery: {
      subtitle: "Collezione Completa",
      title1: "Tutti i",
      title2: "Lavori",
      lead: "Esplora il portfolio completo. Usa i filtri per sfogliare per categoria, sessione, fotomodella o data.",
      searchLabel: "Cerca",
      searchPlaceholder: "Cerca foto...",
      categoryLabel: "Categoria",
      allCategories: "Tutte le Categorie",
      shootingLabel: "Sessione",
      allShootings: "Tutte le Sessioni",
      photomodelLabel: "Fotomodella",
      allModels: "Tutte le Modelle",
      dateLabel: "Data",
      allDates: "Tutte le Date",
      reset: "Azzera",
      sortLabel: "Ordina per:",
      sortVotes: "Più Popolari",
      sortDateNew: "Più Recenti",
      sortDateOld: "Più Vecchie",
      sortName: "Nome A–Z",
      photosFound: (n: number) => `${n} foto ${n !== 1 ? "trovate" : "trovata"}`,
      noPhotosTitle: "Nessuna foto trovata",
      noPhotosText: "Prova a modificare i filtri per scoprire altri scatti.",
      vote: "Vota",
      voted: "Già votato",
      voteCount: (n: number) => `${n} voti`,
    },
  },

  en: {
    nav: {
      home: "Home",
      portfolio: "Portfolio",
      about: "About",
      contact: "Contact",
      gallery: "Gallery",
    },

    hero: {
      eyebrow: "Photography Portfolio",
      title1: "Nai",
      title2: "tiry",
      description: "Capturing emotions, light, and stories through the lens. Based in Italy, available worldwide.",
      cta: "Explore My Work →",
      scroll: "Scroll",
    },

    featured: {
      subtitle: "Most Loved",
      title1: "Featured",
      title2: "Work",
      viewAll: "View Full Gallery →",
    },

    about: {
      subtitle: "About Me",
      title1: "The Eye Behind",
      title2: "the Lens",
      paragraph1: "Hi, I'm Isabel — a young Italian photographer with a deep passion for capturing the beauty in everyday moments. From sun-kissed portraits to atmospheric street scenes, my work blends natural light with authentic emotion.",
      paragraph2: "I believe every photograph should tell a story. Whether it's a wedding, a creative editorial, or the quiet magic of a landscape, I pour my heart into every single frame.",
      stat1Label: "Projects",
      stat2Label: "Years Experience",
      stat3Label: "Happy Clients",
    },

    contact: {
      subtitle: "Get in Touch",
      title1: "Let's Create",
      title2: "Something Beautiful",
      paragraph: "Have a project in mind? I'd love to hear from you. Whether it's a portrait session, an event, or a creative collaboration — let's make it happen.",
      namePlaceholder: "Your Name",
      emailPlaceholder: "Your Email",
      subjectPlaceholder: "Subject",
      messagePlaceholder: "Tell me about your project...",
      sendButton: "Send Message",
      location: "Foggia, Italy",
    },

    footer: {
      rights: "© 2026 Naitiry. All rights reserved.",
    },

    gallery: {
      subtitle: "Full Collection",
      title1: "All",
      title2: "Work",
      lead: "Explore the complete portfolio. Use the filters to browse by category, shooting, photomodel, or date.",
      searchLabel: "Search",
      searchPlaceholder: "Search photos...",
      categoryLabel: "Category",
      allCategories: "All Categories",
      shootingLabel: "Shooting",
      allShootings: "All Shootings",
      photomodelLabel: "Photomodel",
      allModels: "All Models",
      dateLabel: "Date",
      allDates: "All Dates",
      reset: "Reset",
      sortLabel: "Sort by:",
      sortVotes: "Most Popular",
      sortDateNew: "Newest First",
      sortDateOld: "Oldest First",
      sortName: "Name A–Z",
      photosFound: (n: number) => `${n} photo${n !== 1 ? "s" : ""} found`,
      noPhotosTitle: "No photos found",
      noPhotosText: "Try adjusting your filters to discover more work.",
      vote: "Vote",
      voted: "Already voted",
      voteCount: (n: number) => `${n} votes`,
    },
  },
};
