import React, { useState, useRef, useCallback, useEffect } from 'react';
import type { InputMode, GeneratedContent } from '../types';
import { generateContentFromImage, generateContentFromUrl } from '../services/geminiService';

interface InputTabsProps {
  setIsLoading: (loading: boolean) => void;
  onGeneration: (content: GeneratedContent) => void;
  onError: (error: string) => void;
  isLoading: boolean;
  onSourceImageReady: (data: { base64: string; mimeType: string } | null) => void;
}

const UploadIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6 mr-2"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const LinkIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6 mr-2"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
);

const CameraIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6 mr-2"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

// Fix: Redefined TabButton with React.FC and a dedicated props interface to resolve type inference issues.
interface TabButtonProps {
  currentMode: InputMode;
  targetMode: InputMode;
  children: React.ReactNode;
  onClick: () => void;
}
const TabButton: React.FC<TabButtonProps> = ({ currentMode, targetMode, children, onClick }) => (
    <button
        onClick={onClick}
        className={`w-1/3 py-3 px-4 text-center font-semibold transition-all duration-300 flex items-center justify-center rounded-md
        ${currentMode === targetMode 
            ? 'gradient-bg text-white shadow-lg' 
            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
    >
        {children}
    </button>
  );

const InputTabs: React.FC<InputTabsProps> = ({ setIsLoading, onGeneration, onError, isLoading, onSourceImageReady }) => {
  const [mode, setMode] = useState<InputMode>('image');
  const [productUrl, setProductUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const resetState = () => {
    onGeneration({ 
      titles: [], descriptions: [], productPricing: [], tags: [], hashtags: [],
      socialMediaPosts: [], shortVideoScripts: [], fictionalTestimonials: [],
      longTailKeywords: [], metaTagsAndAltTexts: [], blogArticles: [], buyingGuides: [], faqs: [],
      promotionalPhrases: [], marketingEmails: [], priceVariations: [], discountCoupons: [], countdownPromos: [], popupCopies: [],
      landingPageCopies: [], competitorComparisons: [], interactiveQuizzes: [], chatbotScripts: [],
      groundingChunks: [] 
    });
    onError('');
    onSourceImageReady(null);
  };

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const startCamera = async () => {
      stopCamera(); 
      try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
          setStream(stream);
          if (videoRef.current) {
              videoRef.current.srcObject = stream;
          }
      } catch (err) {
          console.error("Camera error:", err);
          onError("Não foi possível acessar a câmera. Verifique as permissões do seu navegador.");
      }
  };
  
  useEffect(() => {
    if (mode === 'camera') {
        startCamera();
    } else {
        stopCamera();
    }
    return () => {
        stopCamera();
    };
  }, [mode]);


  const processAndGenerateFromDataUrl = async (dataUrl: string) => {
    const base64String = dataUrl.split(',')[1];
    const stringLength = base64String.length - (base64String.endsWith('==') ? 2 : (base64String.endsWith('=') ? 1 : 0));
    const sizeInBytes = (stringLength * 3) / 4;
    
    if (sizeInBytes > 4 * 1024 * 1024) { // 4MB limit
        onError("A imagem é muito grande. O limite é 4MB.");
        setIsLoading(false);
        return;
    }

    resetState();
    setImagePreview(dataUrl);
    setIsLoading(true);

    try {
        const [mimeTypePart, base64Part] = dataUrl.split(';base64,');
        const mimeType = mimeTypePart.split(':')[1];
        
        onSourceImageReady({ base64: base64Part, mimeType });
        const content = await generateContentFromImage(base64Part, mimeType);
        onGeneration(content);
    } catch (error) {
        const err = error as Error;
        onError(err.message || 'Ocorreu um erro desconhecido.');
    } finally {
        setIsLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      processAndGenerateFromDataUrl(reader.result as string);
    };
    reader.onerror = () => {
      onError("Falha ao ler o arquivo de imagem.");
    }
  };
  
  const handleCapture = () => {
      if (!videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
          stopCamera();
          processAndGenerateFromDataUrl(dataUrl);
      }
  };


  const handleUrlSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!productUrl.trim()) {
      onError("Por favor, insira um link válido.");
      return;
    }
    
    resetState();
    setIsLoading(true);
    
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
  

  return (
    <div className="bg-[var(--card-light)] dark:bg-[var(--card-dark)] shadow-xl rounded-2xl overflow-hidden border border-[var(--border-light)] dark:border-[var(--border-dark)] transition-colors duration-300">
      <div className="p-4 sm:p-6 bg-gray-50 dark:bg-black/20">
        <div className="flex space-x-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <TabButton currentMode={mode} targetMode="image" onClick={() => setMode('image')}>
              <UploadIcon /> <span className="hidden sm:inline ml-2">Imagem</span>
          </TabButton>
          <TabButton currentMode={mode} targetMode="camera" onClick={() => setMode('camera')}>
              <CameraIcon /> <span className="hidden sm:inline ml-2">Câmera</span>
          </TabButton>
          <TabButton currentMode={mode} targetMode="url" onClick={() => { setMode('url'); setImagePreview(null); }}>
              <LinkIcon /> <span className="hidden sm:inline ml-2">Link</span>
          </TabButton>
        </div>
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
              className="w-full px-6 py-10 border-2 border-dashed border-[var(--border-light)] dark:border-[var(--border-dark)] rounded-xl text-gray-500 dark:text-gray-400 hover:border-[var(--primary-accent)] dark:hover:border-[var(--primary-accent)] hover:text-[var(--primary-accent)] dark:hover:text-[var(--primary-accent)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center justify-center bg-gray-50 dark:bg-black/20 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
            >
              <UploadIcon className="h-10 w-10 mb-2"/>
              <span className="font-semibold">Clique para importar uma imagem</span>
              <span className="text-xs mt-1">(PNG, JPG, WEBP - Max 4MB)</span>
            </button>
          </div>
        )}

        {mode === 'camera' && (
            <div className="flex flex-col items-center">
                <div className="w-full max-w-lg bg-black rounded-lg overflow-hidden mb-4 border-2 border-[var(--border-dark)] shadow-lg">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-auto aspect-video object-cover" />
                </div>
                <canvas ref={canvasRef} className="hidden" />
                <button
                    onClick={handleCapture}
                    disabled={isLoading || !stream}
                    className="px-8 py-3 gradient-bg text-white font-bold rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-accent)] disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 flex items-center shadow-lg transform hover:scale-105"
                >
                    <CameraIcon /> <span className="ml-2">Capturar Imagem</span>
                </button>
            </div>
        )}

        {mode === 'url' && (
          <form onSubmit={handleUrlSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="url"
                value={productUrl}
                onChange={(e) => setProductUrl(e.target.value)}
                placeholder="https://exemplo.com/produto"
                className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-900/50 border-2 border-[var(--border-light)] dark:border-[var(--border-dark)] rounded-lg focus:ring-2 focus:ring-[var(--primary-accent)] focus:border-transparent outline-none transition-all duration-300"
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 gradient-bg text-white font-bold rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-accent)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg transform hover:scale-105"
              disabled={isLoading}
            >
              {isLoading ? 'Gerando...' : 'Gerar Conteúdo'}
            </button>
          </form>
        )}

        {imagePreview && (
            <div className="mt-8">
                <p className="text-sm font-medium mb-3 text-center text-gray-500 dark:text-gray-400">Imagem para análise:</p>
                <div className="max-w-xs mx-auto rounded-xl shadow-lg overflow-hidden p-2 bg-gray-100 dark:bg-gray-900/50">
                  <img src={imagePreview} alt="Product preview" className="w-full rounded-lg" />
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default InputTabs;