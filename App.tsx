import React, { useState } from 'react';
import InputTabs from './components/InputTabs';
import ResultDisplay from './components/ResultDisplay';
import type { GeneratedContent, GeneratedImage, ImageType } from './types';

const initialContentState: GeneratedContent = {
  // Conteúdo Essencial
  titles: [],
  descriptions: [],
  productPricing: [],
  tags: [],
  hashtags: [],

  // Redes Sociais e Engajamento
  socialMediaPosts: [],
  shortVideoScripts: [],
  fictionalTestimonials: [],
  
  // SEO Avançado e Marketing de Conteúdo
  longTailKeywords: [],
  metaTagsAndAltTexts: [],
  blogArticles: [],
  buyingGuides: [],
  faqs: [],

  // Campanhas de Vendas e Promoções
  promotionalPhrases: [],
  marketingEmails: [],
  priceVariations: [],
  discountCoupons: [],
  countdownPromos: [],
  popupCopies: [],

  // Ferramentas Avançadas e Interativas
  landingPageCopies: [],
  competitorComparisons: [],
  interactiveQuizzes: [],
  chatbotScripts: [],
  
  groundingChunks: [],
};

const initialImageState: GeneratedImage = {
  base64: null,
  isLoading: false,
  error: null,
};


const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent>(initialContentState);
  const [error, setError] = useState<string | null>(null);
  const [sourceImage, setSourceImage] = useState<{ base64: string; mimeType: string; } | null>(null);
  const [generatedImages, setGeneratedImages] = useState<Record<ImageType, GeneratedImage>>({
    // Imagens de Produto Profissionais
    white_background: { ...initialImageState },
    instagram_post_promo: { ...initialImageState },
    facebook_post_ad: { ...initialImageState },
    instagram_story_promo: { ...initialImageState },

    // Mockups Realistas
    mockup_with_model_lifestyle: { ...initialImageState },
    mockup_with_model_professional: { ...initialImageState },
    mockup_product_focused: { ...initialImageState },
    mockup_close_up: { ...initialImageState },

    // Banners e Templates para Redes Sociais
    banner_promo_coupon: { ...initialImageState },
    banner_seasonal_bf: { ...initialImageState },
    banner_facebook_cover: { ...initialImageState }, 
    template_instagram_post: { ...initialImageState },
    template_instagram_story: { ...initialImageState },
    vertical_tiktok_reels: { ...initialImageState }, 
    vertical_whatsapp_status: { ...initialImageState },
    
    // Efeitos e Mídias Dinâmicas
    effect_3d_shadow: { ...initialImageState },
    effect_floating: { ...initialImageState },

    // Conteúdos Educativos e Complementares
    infographic_benefits: { ...initialImageState },
    youtube_thumbnail: { ...initialImageState },
  });


  const handleGeneration = (content: GeneratedContent) => {
    setGeneratedContent(content);
    setGeneratedImages({ // Reset images when new text is generated
      white_background: { ...initialImageState },
      instagram_post_promo: { ...initialImageState },
      facebook_post_ad: { ...initialImageState },
      instagram_story_promo: { ...initialImageState },
      mockup_with_model_lifestyle: { ...initialImageState },
      mockup_with_model_professional: { ...initialImageState },
      mockup_product_focused: { ...initialImageState },
      mockup_close_up: { ...initialImageState },
      banner_promo_coupon: { ...initialImageState },
      banner_seasonal_bf: { ...initialImageState },
      banner_facebook_cover: { ...initialImageState },
      template_instagram_post: { ...initialImageState },
      template_instagram_story: { ...initialImageState },
      vertical_tiktok_reels: { ...initialImageState },
      vertical_whatsapp_status: { ...initialImageState },
      effect_3d_shadow: { ...initialImageState },
      effect_floating: { ...initialImageState },
      infographic_benefits: { ...initialImageState },
      youtube_thumbnail: { ...initialImageState },
    });
    setError(null);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setGeneratedContent(initialContentState);
    setSourceImage(null);
  };

  const handleSourceImage = (data: { base64: string; mimeType: string } | null) => {
    setSourceImage(data);
  };

  return (
    <div className="min-h-screen text-[var(--text-light)] dark:text-[var(--text-dark)] font-sans transition-colors duration-300">
      <main className="container mx-auto px-4 py-8 md:py-16">
        <header className="text-center mb-12">
           <h1 className="text-5xl md:text-6xl font-extrabold gradient-text">
            MEGAPOST
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Sua suíte completa de IA para marketing de produtos. Gere todo o conteúdo para seu post com um único clique.
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          <InputTabs 
            setIsLoading={setIsLoading} 
            onGeneration={handleGeneration}
            onError={handleError}
            isLoading={isLoading}
            onSourceImageReady={handleSourceImage}
          />
          <ResultDisplay 
            isLoading={isLoading} 
            content={generatedContent}
            error={error} 
            sourceImage={sourceImage}
            generatedImages={generatedImages}
            setGeneratedImages={setGeneratedImages}
          />
        </div>
        <footer className="text-center mt-16 text-sm text-gray-500 dark:text-gray-500">
          <p>Powered by Google Gemini</p>
        </footer>
      </main>
    </div>
  );
};

export default App;