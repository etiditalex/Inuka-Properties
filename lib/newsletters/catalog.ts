export type StaticNewsletterIssue = {
  id: number;
  title: string;
  description: string | null;
  file_url: string | null;
  published_at: string;
  sort_order: number;
};

export const STATIC_NEWSLETTER_ISSUES: StaticNewsletterIssue[] = [];

export const STATIC_NEWSLETTER_BENEFITS = [
  "Latest property listings",
  "Exclusive offers and promotions",
  "Market insights and trends",
  "Company news and updates",
  "Investment tips and guides",
];
