export interface Project {
  title: string;
  category: string;
  slug: string;
  skills: string[];
  tags: string[];
  description: string;
  created_at: Date;
  start_date?: Date;
  provider: string;
}
