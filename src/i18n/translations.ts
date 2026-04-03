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
      pricelist: "Listino Prezzi",
    },

    // Hero
    hero: {
      eyebrow: "Portfolio Fotografico di Naitiry | Foggia, Italia",
      title1: "Naitiry",
      title2: "",
      description: "Benvenuti nel portfolio fotografico professionale di Naitiry. Sono una fotografa professionista che si dedica a catturare emozioni, luce e storie uniche attraverso l'obiettivo. Scatto ritratti mozzafiato, reportage di eventi indimenticabili e offro i miei servizi in tutta Italia, con sede principale a Foggia.",
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
      paragraph1: "Ciao, sono Isabel — conosciuta professionalmente come Naitiry. Sono una giovane fotografa professionista, che lavora e vive principalmente a Foggia e provincia, ma sono sempre disponibile a viaggiare in tutta Italia. Nutro una profonda e sincera passione per catturare la bellezza autentica nei momenti quotidiani. Dai ritratti baciati dal sole alle scene urbane cariche di atmosfera, il mio portfolio fotografico mescola l'uso sapiente della luce naturale con l'emozione vera e genuina dei soggetti.",
      paragraph2: "Credo fortemente che ogni fotografia debba raccontare una sua storia unica. Che si tratti del giorno magico di un matrimonio, di un delicato editoriale creativo o della bellezza silenziosa di un paesaggio immerso nella natura, metto tutto il mio cuore e la mia creatività in ogni singolo scatto nel mio portfolio professionale. Esplora questa pagina per conoscere meglio la mia visione, e se cerchi una fotografa a Foggia che sappia andare oltre la semplice immagine, sei nel posto giusto.",
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
      lead: "Benvenuti nella galleria ufficiale di Isabel Finaldi Photography. In questa pagina potrai ammirare tutti i lavori e i progetti fotografici che ho realizzato con dedizione e passione. La mia galleria rappresenta un viaggio visivo unico, pensato per emozionare e ispirare. Ogni scatto racconta una storia, catturando l'essenza e la bellezza dei soggetti attraverso la mia prospettiva. Questa è la raccolta di tutti i lavori in cui ho infuso il mio stile distintivo. Usa i filtri di questa galleria per esplorare in modo approfondito il portfolio: puoi cercare e sfogliare comodamente le immagini per categoria, per specifica sessione, per fotomodella, oppure in base alla data.",
      searchLabel: "Cerca",
      filtersLabel: "Filtri",
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
      categories: {
        Ritratto: "Ritratto",
        Paesaggio: "Paesaggio",
        Street: "Street",
        Eventi: "Eventi",
        Creativo: "Creativo",
      },
    },
  },

  en: {
    nav: {
      home: "Home",
      portfolio: "Portfolio",
      about: "About",
      contact: "Contact",
      gallery: "Gallery",
      pricelist: "Pricelist",
    },

    hero: {
      eyebrow: "Naitiry Photography Portfolio | Foggia, Italy",
      title1: "Naitiry",
      title2: "",
      description: "Welcome to the professional photography portfolio of Naitiry. I am a professional photographer dedicated to capturing emotions, light, and unique stories through the lens. I shoot breathtaking portraits, unforgettable event reportages, and offer my photography services all over Italy, primarily based in Foggia.",
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
      paragraph1: "Hi, I'm Isabel — known professionally as Naitiry. I am a young Italian professional photographer, who works and lives mainly in Foggia and province, but I'm always available to travel across Italy. I nurture a deep and sincere passion for capturing authentic beauty in everyday moments. From sun-kissed portraits to atmospheric street scenes, my photography portfolio blends the skillful use of natural light with the true and genuine emotion of the subjects.",
      paragraph2: "I strongly believe that every photograph should tell its own unique story. Whether it's the magical day of a wedding, a delicate creative editorial, or the quiet beauty of a landscape immersed in nature, I pour my heart and creativity into every single frame of my professional portfolio. Explore this page to learn more about my vision, and if you are looking for a photographer in Foggia who knows how to go beyond the simple image, you are in the right place.",
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
      lead: "Welcome to the official gallery of Isabel Finaldi Photography. On this page, you will be able to admire all the work and photographic projects that I have created with dedication. My gallery represents a unique visual journey, designed to move and inspire. Every shot tells a true story, capturing the essence and beauty of the subjects through my creative perspective. This is the collection of all the work where I have infused my distinctive style. Use the tools and filters provided in this gallery to thoroughly explore my extensive portfolio: you can easily search and browse the images by category, by specific shooting session, by photomodel, or organizing them by date.",
      searchLabel: "Search",
      filtersLabel: "Filters",
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
      categories: {
        Ritratto: "Portrait",
        Paesaggio: "Landscape",
        Street: "Street",
        Eventi: "Events",
        Creativo: "Creative",
      },
    },
  },
};
