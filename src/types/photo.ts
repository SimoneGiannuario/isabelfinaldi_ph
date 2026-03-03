export interface Photo {
  id: number | string;
  src: string;
  title: string;
  category: string;
  shootingName: string;
  photomodel: string | string[] | null;
  date: string;
  featured: boolean;
  votes: number;
  custom?: boolean;
  fromNhost?: boolean;
  storageId?: string;
}
