export interface NavTranslations {
  home: string;
  portfolio: string;
  about: string;
  contact: string;
  gallery: string;
}

export interface HeroTranslations {
  eyebrow: string;
  title1: string;
  title2: string;
  description: string;
  cta: string;
  scroll: string;
}

export interface FeaturedTranslations {
  subtitle: string;
  title1: string;
  title2: string;
  viewAll: string;
}

export interface AboutTranslations {
  subtitle: string;
  title1: string;
  title2: string;
  paragraph1: string;
  paragraph2: string;
  stat1Label: string;
  stat2Label: string;
  stat3Label: string;
}

export interface ContactTranslations {
  subtitle: string;
  title1: string;
  title2: string;
  paragraph: string;
  namePlaceholder: string;
  emailPlaceholder: string;
  subjectPlaceholder: string;
  messagePlaceholder: string;
  sendButton: string;
  location: string;
}

export interface FooterTranslations {
  rights: string;
}

export interface GalleryTranslations {
  subtitle: string;
  title1: string;
  title2: string;
  lead: string;
  searchLabel: string;
  filtersLabel: string;
  searchPlaceholder: string;
  categoryLabel: string;
  allCategories: string;
  shootingLabel: string;
  allShootings: string;
  photomodelLabel: string;
  allModels: string;
  dateLabel: string;
  allDates: string;
  reset: string;
  sortLabel: string;
  sortVotes: string;
  sortDateNew: string;
  sortDateOld: string;
  sortName: string;
  photosFound: (n: number) => string;
  noPhotosTitle: string;
  noPhotosText: string;
  vote: string;
  voted: string;
  voteCount: (n: number) => string;
  categories: Record<string, string>;
}

export interface TranslationSet {
  nav: NavTranslations;
  hero: HeroTranslations;
  featured: FeaturedTranslations;
  about: AboutTranslations;
  contact: ContactTranslations;
  footer: FooterTranslations;
  gallery: GalleryTranslations;
}

export type Lang = "it" | "en";

export type Translations = Record<Lang, TranslationSet>;
