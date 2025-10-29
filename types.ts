
export type InputMode = 'image' | 'url' | 'camera';

export type ImageType = 
  // Imagens de Produto Profissionais
  | 'white_background' 
  | 'instagram_post_promo'
  | 'facebook_post_ad'
  | 'instagram_story_promo'

  // Mockups Realistas
  | 'mockup_with_model_lifestyle'
  | 'mockup_with_model_professional'
  | 'mockup_product_focused'
  | 'mockup_close_up'

  // Banners e Templates para Redes Sociais
  | 'banner_promo_coupon'
  | 'banner_seasonal_bf'
  | 'banner_facebook_cover'
  | 'template_instagram_post'
  | 'template_instagram_story'
  | 'vertical_tiktok_reels'
  | 'vertical_whatsapp_status'

  // Efeitos e Mídias Dinâmicas
  | 'effect_3d_shadow'
  | 'effect_floating'

  // Conteúdos Educativos e Complementares
  | 'infographic_benefits'
  | 'youtube_thumbnail';


export type GeneratedImage = {
  base64: string | null;
  isLoading: boolean;
  error: string | null;
};

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

export type EventType = "Venda Aprovada" | "Pix Gerado" | "Pedido Enviado" | "Venda Cancelada" | "Pix Expirado";

export type NotificationData = {
    eventType: EventType;
    value: string;
    product: string;
    time: string;
    client: string;
    paymentMethod: string; // The text to display, e.g., "Cartão de Crédito"
    paymentLogoSvg: string; // The raw SVG string for the logo image
};