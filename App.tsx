import React, { useState } from 'react';
import InputTabs from './components/InputTabs';
import ResultDisplay from './components/ResultDisplay';
import type { GeneratedContent } from './types';

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

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent>(initialContentState);
  const [error, setError] = useState<string | null>(null);

  const handleGeneration = (content: GeneratedContent) => {
    setGeneratedContent(content);
    setError(null);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setGeneratedContent(initialContentState);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400">
            MEGAPOST
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Sua suíte completa de IA para marketing de produtos. Gere todo o conteúdo para seu post com um único clique.
          </p>
        </header>

        <div className="max-w-3xl mx-auto">
          <InputTabs 
            setIsLoading={setIsLoading} 
            onGeneration={handleGeneration}
            onError={handleError}
            isLoading={isLoading}
          />
          <ResultDisplay 
            isLoading={isLoading} 
            content={generatedContent}
            error={error} 
          />
        </div>
        <footer className="text-center mt-12 text-sm text-gray-500 dark:text-gray-600">
          <p>Powered by Google Gemini</p>
        </footer>
      </main>
    </div>
  );
};

export default App;