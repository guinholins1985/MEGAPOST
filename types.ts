export type InputMode = 'image' | 'url';

export type GeneratedContent = {
  // SEO & Product Essentials
  titles: string[];
  descriptions: string[];
  tags: string[];
  longTailKeywords: string[];
  metaTagsAndAltTexts: string[];
  
  // Social Media & Engagement
  hashtags: string[];
  socialMediaPosts: string[];
  fictionalTestimonials: string[];
  shortVideoScripts: string[];
  
  // Marketing & Sales Campaigns
  promotionalPhrases: string[];
  marketingEmails: string[];
  blogArticles: string[];
  buyingGuides: string[];
  productPricing: string[];

  // Dynamic & Interactive Content
  faqs: string[];
  priceVariations: string[];
  competitorComparisons: string[];
  countdownPromos: string[];
  discountCoupons: string[];
  landingPageCopies: string[];
  popupCopies: string[];
  interactiveQuizzes: string[];
  chatbotScripts: string[];
  
  groundingChunks?: any[];
};