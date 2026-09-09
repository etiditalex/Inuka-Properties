export type ChatLink = {
  label: string;
  href: string;
};

export type ChatbotReply = {
  text: string;
  links?: ChatLink[];
  suggestWhatsApp?: boolean;
  openWhatsApp?: boolean;
  collectInquiry?: ChatbotInquiryDraft;
};

export type ChatbotInquiryKind = "price" | "question";

export type ChatbotInquiryDraft = {
  kind: ChatbotInquiryKind;
  propertyId?: number | null;
  propertyTitle?: string | null;
  question: string;
  subject?: string;
};

/** @deprecated Use ChatbotInquiryDraft */
export type PriceInquiryDraft = ChatbotInquiryDraft;

export type ChatbotFaq = {
  question: string;
  answer: string;
};

export type ChatbotProperty = {
  id: number;
  title: string;
  aliases: string[];
  location: string;
  type: string;
  price: string;
  size: string;
  status: string;
  features: string[];
  pricing?: Record<string, string>;
  paymentPlan?: Record<string, string>;
  description?: string;
  path: string;
  mapLink?: string;
  faqs: ChatbotFaq[];
};

export type ChatbotDownload = {
  id: number;
  title: string;
  fileUrl: string;
  aliases: string[];
  parentId: number | null;
};

export type ChatbotKnowledge = {
  properties: ChatbotProperty[];
  extraProjects: ChatbotProperty[];
  downloads: ChatbotDownload[];
  pages: ChatbotPage[];
};

export type ChatbotPageKind = "blog" | "news" | "page" | "service" | "about" | "faq";

export type ChatbotPage = {
  id: string;
  kind: ChatbotPageKind;
  title: string;
  path: string;
  aliases: string[];
  summary: string;
  searchText: string;
};

export type LiveBlogPost = {
  title: string;
  excerpt?: string | null;
  slug?: string | null;
  category?: string | null;
};

export type LiveNewsItem = {
  title: string;
  excerpt?: string | null;
  details?: string[] | null;
};

export type LiveCatalogProperty = {
  id: number;
  title: string;
  location: string;
  type: string;
  price: string;
  size: string;
  status?: string;
  features?: string[];
};

export type LiveDownloadItem = {
  id: number;
  title: string;
  file_url: string;
  parent_id: number | null;
};
