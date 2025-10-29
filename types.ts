export type InputMode = 'image' | 'url';

export type GeneratedContent = {
  // Conteúdo Essencial
  titles: string[];
  descriptions: string[];
  productPricing: string[];
  tags: string[];
  hashtags: string[];

  // Redes Sociais e Engajamento
  socialMediaPosts: string[];
  shortVideoScripts: string[];
  fictionalTestimonials: string[];
  
  // SEO Avançado e Marketing de Conteúdo
  longTailKeywords: string[];
  metaTagsAndAltTexts: string[];
  blogArticles: string[];
  buyingGuides: string[];
  faqs: string[];

  // Campanhas de Vendas e Promoções
  promotionalPhrases: string[];
  marketingEmails: string[];
  priceVariations: string[];
  discountCoupons: string[];
  countdownPromos: string[];
  popupCopies: string[];

  // Ferramentas Avançadas e Interativas
  landingPageCopies: string[];
  competitorComparisons: string[];
  interactiveQuizzes: string[];
  chatbotScripts: string[];
  
  groundingChunks?: any[];
};