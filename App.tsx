import React, { useState } from 'react';
import InputTabs from './components/InputTabs';
import ResultDisplay from './components/ResultDisplay';
import BrandingGenerator from './components/BrandingGenerator';
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

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="bg-[var(--card-light)] dark:bg-[var(--card-dark)] p-6 rounded-xl border border-[var(--border-light)] dark:border-[var(--border-dark)] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
    <div className="gradient-bg text-white rounded-lg h-12 w-12 flex items-center justify-center mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400">{children}</p>
  </div>
);


const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent>(initialContentState);
  const [error, setError] = useState<string | null>(null);
  const [sourceImage, setSourceImage] = useState<{ base64: string; mimeType: string; } | null>(null);
  const [brandingPrompt, setBrandingPrompt] = useState('');
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
    if(content.titles.length > 0) {
      setBrandingPrompt(`Uma marca para: ${content.titles[0]}`);
    } else {
      setBrandingPrompt('');
    }
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
  
  const hasContent = Object.values(generatedContent).some(val => Array.isArray(val) && val.length > 0);

  return (
    <div className="min-h-screen text-[var(--text-light)] dark:text-[var(--text-dark)] font-sans transition-colors duration-300">
      <main className="container mx-auto px-4 py-8 md:py-12">
        
        {/* Hero Section */}
        <header className="text-center py-16 md:py-24 relative overflow-hidden">
            <div className="absolute inset-0 -z-10 bg-grid-gray-200/50 dark:bg-grid-gray-800/50 [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)]"></div>
            <h1 className="text-5xl md:text-7xl font-extrabold gradient-text leading-tight">
                MEGAPOST
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Transforme seu produto em uma campanha de marketing completa com IA. Gere textos, imagens, logos e mais, com apenas um clique.
            </p>
            <a href="#generator" className="mt-8 inline-block px-8 py-4 gradient-bg text-white font-bold rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-accent)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg transform hover:scale-105 text-lg">
                Começar a Criar Agora
            </a>
        </header>

        {/* Features Section */}
        <section className="py-16 md:py-24">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Uma Ferramenta, Todas as Soluções</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-12 max-w-3xl mx-auto">De textos que vendem a uma identidade visual completa, o MEGAPOST é o seu time de marketing digital.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <FeatureCard title="Textos Persuasivos" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>}>
                    Gere títulos, descrições, posts para redes sociais, e-mails, roteiros de vídeo e muito mais, tudo otimizado para SEO e conversão.
                </FeatureCard>
                <FeatureCard title="Mídia Visual de Impacto" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}>
                    Transforme fotos de produtos em imagens profissionais com fundo branco, mockups realistas e banners para qualquer plataforma.
                </FeatureCard>
                <FeatureCard title="Identidade Visual Completa" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>}>
                    Crie logos minimalistas e banners profissionais para sua loja (Shopee, Facebook) em segundos, com base na identidade da sua marca.
                </FeatureCard>
            </div>
        </section>

        {/* How it works Section */}
        <section className="py-16 md:py-24 text-center bg-[var(--card-light)] dark:bg-[var(--card-dark)] rounded-2xl border border-[var(--border-light)] dark:border-[var(--border-dark)]">
            <h2 className="text-3xl md:text-4xl font-bold mb-12">Como Funciona em 3 Passos Simples</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-5xl mx-auto">
                <div className="flex flex-col items-center">
                    <div className="gradient-bg text-white rounded-full h-16 w-16 flex items-center justify-center text-2xl font-bold shadow-lg mb-4">1</div>
                    <h3 className="text-xl font-semibold mb-2">Envie seu Produto</h3>
                    <p className="text-gray-600 dark:text-gray-400">Importe uma imagem, use a câmera ou cole um link do seu produto.</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="gradient-bg text-white rounded-full h-16 w-16 flex items-center justify-center text-2xl font-bold shadow-lg mb-4">2</div>
                    <h3 className="text-xl font-semibold mb-2">Gere Conteúdo com IA</h3>
                    <p className="text-gray-600 dark:text-gray-400">Nossa IA cria textos, mídias visuais e logos otimizados para conversão.</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="gradient-bg text-white rounded-full h-16 w-16 flex items-center justify-center text-2xl font-bold shadow-lg mb-4">3</div>
                    <h3 className="text-xl font-semibold mb-2">Copie e Publique</h3>
                    <p className="text-gray-600 dark:text-gray-400">Copie o conteúdo gerado com um clique e use em suas campanhas.</p>
                </div>
            </div>
        </section>

        <div id="generator" className="max-w-7xl mx-auto mt-24 scroll-mt-24">
           <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">Passo 1: Gere o Conteúdo de Marketing</h2>
           <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-8 max-w-4xl mx-auto">Forneça seu produto e deixe a IA fazer o trabalho pesado.</p>
          <div className="max-w-4xl mx-auto">
            <InputTabs 
              setIsLoading={setIsLoading} 
              onGeneration={handleGeneration}
              onError={handleError}
              isLoading={isLoading}
              onSourceImageReady={handleSourceImage}
            />
          </div>
          {hasContent && !isLoading && !error && (
            <BrandingGenerator
              initialPrompt={brandingPrompt}
              sourceImage={sourceImage}
            />
          )}
          <ResultDisplay 
            isLoading={isLoading} 
            content={generatedContent}
            error={error} 
            sourceImage={sourceImage}
            generatedImages={generatedImages}
            setGeneratedImages={setGeneratedImages}
          />
        </div>
        <footer className="text-center mt-24 text-sm text-gray-500 dark:text-gray-500">
          <p>Powered by Google Gemini</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
