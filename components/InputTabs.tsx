import React, { useState, useRef, useCallback } from 'react';
import type { InputMode, GeneratedContent } from '../types';
import { generateContentFromImage, generateContentFromUrl } from '../services/geminiService';

interface InputTabsProps {
  setIsLoading: (loading: boolean) => void;
  onGeneration: (content: GeneratedContent) => void;
  onError: (error: string) => void;
  isLoading: boolean;
}

const UploadIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const LinkIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
);

const fileToBase64 = (file: File): Promise<{base64: string, mimeType: string}> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const [mimeTypePart, base64Part] = result.split(';base64,');
      const mimeType = mimeTypePart.split(':')[1];
      resolve({ base64: base64Part, mimeType });
    };
    reader.onerror = (error) => reject(error);
  });


const InputTabs: React.FC<InputTabsProps> = ({ setIsLoading, onGeneration, onError, isLoading }) => {
  const [mode, setMode] = useState<InputMode>('image');
  const [productUrl, setProductUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const resetState = () => {
    onGeneration({ 
      titles: [], descriptions: [], tags: [], hashtags: [], promotionalPhrases: [], socialMediaPosts: [],
      metaTagsAndAltTexts: [], faqs: [], longTailKeywords: [], fictionalTestimonials: [], shortVideoScripts: [],
      marketingEmails: [], blogArticles: [], buyingGuides: [], priceVariations: [], competitorComparisons: [],
      countdownPromos: [], discountCoupons: [], landingPageCopies: [], popupCopies: [], interactiveQuizzes: [],
      chatbotScripts: [], productPricing: [], groundingChunks: [] 
    });
    onError('');
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) { // 4MB limit for inline data
        onError("O arquivo de imagem é muito grande. O limite é 4MB.");
        return;
    }

    setImagePreview(URL.createObjectURL(file));
    setIsLoading(true);
    resetState();

    try {
      const { base64, mimeType } = await fileToBase64(file);
      const content = await generateContentFromImage(base64, mimeType);
      onGeneration(content);
    } catch (error) {
        const err = error as Error;
        onError(err.message || 'Ocorreu um erro desconhecido.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUrlSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!productUrl.trim()) {
      onError("Por favor, insira um link válido.");
      return;
    }

    setIsLoading(true);
    resetState();
    
    try {
        const content = await generateContentFromUrl(productUrl);
        onGeneration(content);
    } catch (error) {
        const err = error as Error;
        onError(err.message || 'Ocorreu um erro desconhecido.');
    } finally {
        setIsLoading(false);
    }
  };
  
  const TabButton = useCallback(({ currentMode, targetMode, children }: { currentMode: InputMode, targetMode: InputMode, children: React.ReactNode }) => (
    <button
        onClick={() => setMode(targetMode)}
        className={`w-1/2 py-3 px-4 text-center font-semibold transition-all duration-300 flex items-center justify-center rounded-t-lg
        ${currentMode === targetMode 
            ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500' 
            : 'bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
    >
        {children}
    </button>
  ), []);


  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transition-colors duration-300">
      <div className="flex">
        <TabButton currentMode={mode} targetMode="image">
            <UploadIcon /> Imagem do Produto
        </TabButton>
        <TabButton currentMode={mode} targetMode="url">
            <LinkIcon /> Link do Produto
        </TabButton>
      </div>

      <div className="p-6 md:p-8">
        {mode === 'image' && (
          <div className="text-center">
            <input
              type="file"
              accept="image/png, image/jpeg, image/webp"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
              disabled={isLoading}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="w-full px-6 py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center justify-center"
            >
              <UploadIcon />
              <span>Clique para importar uma imagem</span>
              <span className="text-xs mt-1">(PNG, JPG, WEBP - Max 4MB)</span>
            </button>
            {imagePreview && (
              <div className="mt-6">
                <p className="text-sm font-medium mb-2">Pré-visualização:</p>
                <img src={imagePreview} alt="Product preview" className="max-w-xs mx-auto rounded-lg shadow-md" />
              </div>
            )}
          </div>
        )}

        {mode === 'url' && (
          <form onSubmit={handleUrlSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="url"
              value={productUrl}
              onChange={(e) => setProductUrl(e.target.value)}
              placeholder="https://exemplo.com/produto"
              className="flex-grow px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 dark:disabled:bg-blue-800 disabled:cursor-not-allowed transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? 'Gerando...' : 'Gerar Conteúdo'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default InputTabs;